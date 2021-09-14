<?php

declare(strict_types=1);

namespace App\Security;

use Ramsey\Uuid\Uuid;
use Symfony\Component\PasswordHasher\Hasher\PlaintextPasswordHasher;

/**
 * Password Hasher
 * Encode password specific way
 * Caution algorithm shared with front.
 */
class PasswordHasher extends PlaintextPasswordHasher
{
    private int $iterations;
    private string $algorithm;
    private int $encodedLength = -1;
    private string $jwtUserUuid;

    /**
     * @param string $algorithm   The digest algorithm to use
     * @param int    $iterations  The number of iterations to use to stretch the password hash
     * @param string $jwtUserUuid JWT User UUID from Env
     */
    public function __construct(string $algorithm = 'sha256', int $iterations = 42, string $jwtUserUuid = '')
    {
        $this->iterations = $iterations;
        $this->algorithm = $algorithm;
        $this->jwtUserUuid = $jwtUserUuid;

        try {
            $this->encodedLength = \strlen($this->hash('', 'salt'));
        } catch (\LogicException $e) {
            // ignore algorithm not supported
        }
    }

    /**
     * {@inheritDoc}
     */
    public function hash(string $plainPassword, string $salt = null): string
    {
        $salted = parent::hash($plainPassword, $salt);

        // First get UUID from username and NS
        $salted = Uuid::uuid5($this->jwtUserUuid, $salted)->toString();

        $digest = bin2hex(hash($this->algorithm, $salted, true));
        // "stretch" hash
        for ($i = 1; $i < $this->iterations; ++$i) {
            $digest = bin2hex(hash($this->algorithm, $digest . $salted, true));
        }

        return $digest;
    }

    /**
     * {@inheritDoc}
     */
    public function verify(string $hashedPassword, string $plainPassword, string $salt = null): bool
    {
        /* @phpstan-ignore-next-line */
        if ($this->isPasswordTooLong($plainPassword)) {
            return false;
        }
        if (\strlen($hashedPassword) !== $this->encodedLength || false !== strpos($hashedPassword, '$')) {
            return false;
        }

        return hash_equals(strtolower($hashedPassword), strtolower($this->hash($plainPassword, $salt)));
    }
}
