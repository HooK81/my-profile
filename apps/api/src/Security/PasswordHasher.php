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
    private int $hashLength = -1;
    private string $jwtUserUuid;

    /**
     * @param string $jwtUserUuid JWT User UUID from Env
     * @param string $algorithm   The digest algorithm to use
     * @param int    $iterations  The number of iterations to use to stretch the password hash
     */
    public function __construct(string $jwtUserUuid, string $algorithm = 'sha256', int $iterations = 42)
    {
        $this->iterations = $iterations;
        $this->algorithm = $algorithm;
        $this->jwtUserUuid = $jwtUserUuid;

        try {
            $this->hashLength = \strlen($this->hash('', 'salt'));
        } catch (\LogicException $e) {
            // ignore algorithm not supported
        }
    }

    /**
     * {@inheritDoc}
     */
    public function hash(string $plainPassword, string $salt = null): string
    {
        if (!\in_array($this->algorithm, hash_algos(), true)) {
            throw new \LogicException(sprintf('The algorithm "%s" is not supported.', $this->algorithm));
        }

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

    public function verify(string $hashedPassword, string $plainPassword, string $salt = null): bool
    {
        if (\strlen($hashedPassword) !== $this->hashLength || false !== strpos($hashedPassword, '$')) {
            return false;
        }

        return hash_equals($hashedPassword, $this->hash($plainPassword, $salt));
    }
}
