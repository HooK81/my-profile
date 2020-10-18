<?php

namespace App\EventListener;

use App\Security\TokenManager;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;

/**
 * JWTCreationListener
 * Add data into JWT token for security checks
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class JWTCreationListener {

    private $tokenManager;

    public function __construct(TokenManager $tokenManager)
    {
        $this->tokenManager = $tokenManager;
    }

    /**
     * Add secret property
     *
     * @param JWTCreatedEvent $event
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload           = $event->getData();
        $payload['secret'] = $this->tokenManager->createTokenSecret();
        $event->setData($payload);
    }

    /**
     * Check secret property
     *
     * @param JWTDecodedEvent $event
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
}