<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\Security\User;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * UserProvider
 * There is no user checks for API because it's public
 * User is used for JWT token.
 * Only check if password match UUID structure.
 *
 * @author Julien CROCHET <julien@crochet.me>
 * @SuppressWarnings(PHPMD.UnusedFormalParameter)
 */
class UserProvider implements UserProviderInterface
{
    private PasswordHasher $passwordHasher;
    private TokenManager $tokenManager;

    public function __construct(PasswordHasher $passwordHasher, TokenManager $tokenManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->tokenManager = $tokenManager;
    }

    /**
     * Symfony calls this method if you use features like switch_user
     * or remember_me.
     *
     * If you're not using these features, you do not need to implement
     * this method.
     *
     * @throws UsernameNotFoundException if the user is not found
     */
    public function loadUserByUsername($username): UserInterface
    {
        return $this->loadUserByIdentifier($username);
    }

    public function loadUserByIdentifier($identifier): UserInterface
    {
        // Build password according username
        $password = $this->passwordHasher->hash($identifier, $this->tokenManager->getClientSaltFromRequest());

        return new User($identifier, $password);
    }

    /**
     * Refreshes the user after being reloaded from the session.
     *
     * When a user is logged in, at the beginning of each request, the
     * User object is loaded from the session and then this method is
     * called. Your job is to make sure the user's data is still fresh by,
     * for example, re-querying for fresh User data.
     *
     * If your firewall is "stateless: true" (for a pure API), this
     * method is not called.
     */
    public function refreshUser(UserInterface $user): UserInterface
    {
        throw new UnsupportedUserException();
    }

    /**
     * Tells Symfony to use this provider for this User class.
     */
    public function supportsClass($class): bool
    {
        return User::class === $class;
    }
}
