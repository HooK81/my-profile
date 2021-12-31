<?php

declare(strict_types=1);

namespace App\Tests\Security;

use App\Entity\Security\User;
use App\Security\PasswordHasher;
use App\Security\TokenManager;
use App\Security\UserProvider;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;

final class UserProviderTest extends TestCase
{
    /** @var TokenManager|MockObject */
    private TokenManager $tokenManager;
    /** @var PasswordHasher|MockObject */
    private PasswordHasher $passwordHasher;

    private UserProvider $userProvider;

    protected function setUp(): void
    {
        $this->tokenManager = $this->getMockBuilder(TokenManager::class)->disableOriginalConstructor()->getMock();
        $this->passwordHasher = $this->getMockBuilder(PasswordHasher::class)->disableOriginalConstructor()->getMock();
        $this->userProvider = new UserProvider($this->passwordHasher, $this->tokenManager);
    }

    public function testLoadUserByIdentifier()
    {
        $user = $this->userProvider->loadUserByIdentifier('userId');
        $this->assertInstanceOf(User::class, $user);
        $this->assertSame('userId', $user->getUserIdentifier());
    }

    public function testLoadUserByUsername()
    {
        $this->expectException(UnsupportedUserException::class);
        $this->userProvider->loadUserByUsername('foo');
    }

    public function testSupportsClass()
    {
        $this->assertTrue($this->userProvider->supportsClass(User::class));
        $this->assertFalse($this->userProvider->supportsClass(\DateTime::class));
    }

    public function testRefreshUser()
    {
        $user = new User('foo');
        $this->expectException(UnsupportedUserException::class);
        $this->userProvider->refreshUser($user);
    }
}
