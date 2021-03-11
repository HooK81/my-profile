<?php

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
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class JWTListener
{
    const COOKIE_LIFETIME = 86400; // 24 hours
    const COOKIE_NAME = 'Bearer';

    private $tokenManager;
    private $env;

    public function __construct(TokenManager $tokenManager, $env)
    {
        $this->tokenManager = $tokenManager;
        $this->env = $env;
    }

    /**
     * Add secret property.
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $payload['secret'] = $this->tokenManager->createTokenSecret();
        $event->setData($payload);
    }

    /**
     * Check secret property.
     */
    public function onJWTDecoded(JWTDecodedEvent $event)
    {
        $payload = $event->getPayload();
        if (!isset($payload['secret'])) {
            $event->markAsInvalid();
        }
        if (!$this->tokenManager->checkTokenSecret($payload['secret'])) {
            $event->markAsInvalid();
        }
    }

    /**
     * Add bearer cookie into authentication response.
     *
     * @return void
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();

        $response = $event->getResponse();
        $response->headers->setCookie(
            new Cookie(
                self::COOKIE_NAME,
                $data['token'],
                time() + self::COOKIE_LIFETIME,
                '/',
                null,
                'dev' !== $this->env, // Secure
                true  // Http Only
            )
        );
    }
}
