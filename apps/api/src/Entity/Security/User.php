<?php

declare(strict_types=1);

namespace App\Entity\Security;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * User Class.
 * There is no user for API because it's public
 * User is used for JWT token.
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private string $username;
    private string $password;

    public function __construct(string $username, string $password = '')
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function getUserIdentifier(): string
    {
        return $this->username;
    }

    public function getUsername(): string
    {
        return $this->getUserIdentifier();
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function eraseCredentials(): void
    {
    }
}
