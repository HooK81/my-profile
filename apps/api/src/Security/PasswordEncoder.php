<?php

namespace App\Security;

use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Core\Encoder\BasePasswordEncoder;

/**
 * PasswordEncoder
 * Encode password specific way
 * Caution algorithm shared with front.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class PasswordEncoder extends BasePasswordEncoder
{
    private $iterations;
    private $algorithm;
    private $encodedLength = -1;

    /**
     * @param string $algorithm  The digest algorithm to use
     * @param int    $iterations The number of iterations to use to stretch the password hash
     */
    public function __construct($algorithm = 'sha256', $iterations = 42)
    {
        $this->iterations = $iterations;
        $this->algorithm = $algorithm;

        try {
            $this->encodedLength = \strlen($this->encodePassword('', 'salt'));
        } catch (\LogicException $e) {
            // ignore algorithm not supported
        }
    }

    /**
     * {@inheritdoc}
     */
    public function encodePassword($raw, $salt)
    {
        $salted = $this->mergePasswordAndSalt($raw, $salt);

        // First get UUID from username and NS
        $salted = Uuid::uuid5($_ENV['APP_JWT_USER_UUID'], $salted)->toString();

        $digest = bin2hex(hash($this->algorithm, $salted, true));
        // "stretch" hash
        for ($i = 1; $i < $this->iterations; ++$i) {
            $digest = bin2hex(hash($this->algorithm, $digest.$salted, true));
        }

        return $digest;
    }

    /**
     * {@inheritdoc}
     */
    public function isPasswordValid($encoded, $raw, $salt)
    {
        if (\strlen($encoded) !== $this->encodedLength || false !== strpos($encoded, '$')) {
            return false;
        }

        return !$this->isPasswordTooLong($raw) && $this->comparePasswords($encoded, $this->encodePassword($raw, $salt));
    }
}
