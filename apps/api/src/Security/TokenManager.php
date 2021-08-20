<?php

declare(strict_types=1);

namespace App\Security;

use Psr\Log\LoggerInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * TokenManager
 * Create and check secret property of JWT Token.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class TokenManager
{
    public const HEADER_KEY = 'Key';
    private Request $request;
    private LoggerInterface $logger;
    private string $passPhrase;
    private string $cipher;
    private string $env;

    public function __construct(RequestStack $requestStack, LoggerInterface $appLogger, string $passPhrase, string $cipher = 'aes-128-cbc', string $env = '')
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->logger = $appLogger;
        $this->passPhrase = $passPhrase;
        $this->cipher = $cipher;
        $this->env = $env;
    }

    /**
     * Create a security property for JWT token
     * Bases on client IP and UserAgent.
     */
    public function createTokenSecret(): string
    {
        $data = $this->getRawSecret();
        $ivlen = openssl_cipher_iv_length($this->cipher);
        $iv = openssl_random_pseudo_bytes($ivlen);
        $ciphertext = openssl_encrypt($data, $this->cipher, $this->passPhrase, 0, $iv);

        return base64_encode($iv . $ciphertext);
    }

    /**
     * Check secret token for current request.
     *
     * @param string $b64Secret
     */
    public function checkTokenSecret($b64Secret): bool
    {
        $secret = base64_decode($b64Secret);
        $ivlen = openssl_cipher_iv_length($this->cipher);
        $iv = substr($secret, 0, $ivlen);
        $data = substr($secret, $ivlen);
        $decoded = openssl_decrypt($data, $this->cipher, $this->passPhrase, 0, $iv);

        $res = $this->getRawSecret() === $decoded;
        if (!$res) {
            $this->logger->warning('[TokenManager][checkTokenSecret] Invalid secret key provided', ['clientIp' => $this->request->getClientIp(), 'userAgent' => $this->request->headers->get('User-Agent')]);
        }

        return $res;
    }

    /**
     * Get salt used by client to encode password.
     *
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function getClientSaltFromRequest(): string
    {
        $salt = $this->request->headers->get(self::HEADER_KEY, '');
        if (!$salt) {
            return 'empty';
        }
        if (!Uuid::isValid($salt)) {
            return 'invalid';
        }

        return $salt;
    }

    /**
     * Get raw data for secret.
     */
    protected function getRawSecret(): string
    {
        return ('dev' !== $this->env ? $this->request->getClientIp() : '') . '=' . $this->request->headers->get('User-Agent');
    }
}
