<?php

declare(strict_types=1);

namespace App\Tests\Security;

use App\Security\PasswordHasher;
use LogicException;
use PHPUnit\Framework\TestCase;

final class PasswordHasherTest extends TestCase
{
    public const UUID = '0fea71dc-2ea0-426c-8f98-28964e6bf2c0';
    public const PASSWORD = 'password';
    public const SALT = 'salt';
    public const HASHED = '7e07da4ecf4f4a0f0092e8b60966b13dda38d25b64d19e93b2ed2bd01ba9f981';

    public function testHash(): void
    {
        $passwordHasher = new PasswordHasher(self::UUID, 'sha256', 10);
        $hash = $passwordHasher->hash(self::PASSWORD, self::SALT);
        $this->assertSame(self::HASHED, $hash);
    }

    public function testUnknownEncoder(): void
    {
        $this->expectException(LogicException::class);
        $passwordHasher = new PasswordHasher(self::UUID, 'foo');
        $passwordHasher->hash('password', 'salt');
    }

    public function testVerify(): void
    {
        $passwordHasher = new PasswordHasher(self::UUID, 'sha256', 10);
        $verified = $passwordHasher->verify(self::HASHED, self::PASSWORD, self::SALT);
        $this->assertTrue($verified);
    }

    public function testVerifyWrongLength(): void
    {
        $passwordHasher = new PasswordHasher(self::UUID, 'sha256', 10);
        $verified = $passwordHasher->verify('foo', 'pwd');
        $this->assertFalse($verified);
    }
}
