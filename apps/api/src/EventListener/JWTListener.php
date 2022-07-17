<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Security\TokenManager;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * JWTListener
 * LexikJWT Listeners
 * onJWTCreated : Add secret property
 * onJWTDecoded : Check secret property
 * onJWTCreated : Add token into Bearer cookie.
 */
class JWTListener
{
    public const COOKIE_NAME = 'Bearer';
    public const COOKIE_STRICT = 'strict';
    public const PROD_ENV = 'prod';
    public const DATA_TOKEN = 'token';
    public const DATA_SECRET = 'secret';

    public function __construct(private TokenManager $tokenManager, private string $env)
    {
    }

    /**
     * Add secret property.
     */
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $payload = $event->getData();
        $payload[self::DATA_SECRET] = $this->tokenManager->createTokenSecret();
        $event->setData($payload);
    }

    /**
     * Check secret property.
     */
    public function onJWTDecoded(JWTDecodedEvent $event): void
    {
        $payload = $event->getPayload();
        if (!isset($payload[self::DATA_SECRET])) {
            $event->markAsInvalid();

            return;
        }
        if (!$this->tokenManager->checkTokenSecret($payload[self::DATA_SECRET])) {
            $event->markAsInvalid();
        }
    }

    /**
     * Add bearer cookie into authentication response.
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData();

        $response = $event->getResponse();
        $response->headers->setCookie(
            new Cookie(
                self::COOKIE_NAME,
                $data[self::DATA_TOKEN],
                $this->tokenManager->calculateTokenMaxLifeTime(),
                '/',
                null,
                self::PROD_ENV === $this->env, // Secure
                true,  // Http Only
                false,
                self::COOKIE_STRICT
            )
        );
    }
}
