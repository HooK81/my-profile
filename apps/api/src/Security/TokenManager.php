<?php

namespace App\Security;

use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * TokenManager
 * Create and check secret property of JWT Token.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class TokenManager
{
    const HEADER_KEY = 'Key';
    private $request;
    private $passPhrase;
    private $cipher;
    private $env;

    public function __construct(RequestStack $requestStack, string $passPhrase, string $cipher = 'aes-128-cbc', string $env = '')
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->passPhrase = $passPhrase;
        $this->cipher = $cipher;
        $this->env = $env;
    }

    /**
     * Create a security property for JWT token
     * Bases on client IP and UserAgent.
     *
     * @return string
     */
    public function createTokenSecret()
    {
        $data = $this->getRawSecret();
        $ivlen = openssl_cipher_iv_length($this->cipher);
        $iv = openssl_random_pseudo_bytes($ivlen);
        $ciphertext = openssl_encrypt($data, $this->cipher, $this->passPhrase, 0, $iv);

        return base64_encode($iv.$ciphertext);
    }

    /**
     * Check secret token for current request.
     *
     * @param string $secret
     *
     * @return bool
     */
    public function checkTokenSecret($secret)
    {
        $c = base64_decode($secret);
        $ivlen = openssl_cipher_iv_length($this->cipher);
        $iv = substr($c, 0, $ivlen);
        $data = substr($c, $ivlen);
        $decoded = openssl_decrypt($data, $this->cipher, $this->passPhrase, 0, $iv);

        return $this->getRawSecret() === $decoded;
    }

    /**
     * Get salt used by client to encode password.
     *
     * @return string
     */
    public function getClientSaltFromRequest()
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
     *
     * @return string
     */
    protected function getRawSecret()
    {
        return ('dev' !== $this->env ? $this->request->getClientIp() : '').'='.$this->request->headers->get('User-Agent');
    }
}
