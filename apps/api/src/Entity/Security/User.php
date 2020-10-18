<?php

namespace App\Entity\Security;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * User Class.
 * There is no user for API because it's public
 * User is used for JWT token.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class User implements UserInterface
{
    private $username;
    private $password;

    /**
     * @param string $username
     * @param string $password
     */
    public function __construct($username, $password = '')
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getSalt()
    {
        return null;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getRoles()
    {
        return ['ROLE_USER'];
    }

    public function eraseCredentials()
    {
    }
}
