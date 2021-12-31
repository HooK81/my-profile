<?php

declare(strict_types=1);

namespace App\Tests\Security;

use App\Security\TokenManager;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Bridge\PhpUnit\ClockMock;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @group time-sensitive
 */
final class TokenManagerTest extends TestCase
{
    public const JWT_PASSPHRASE = '0fea71dc-2ea0-426c-8f98-28964e6bf2c0';
    public const HEADER_KEY = '0fea71dc-2ea0-426c-8f98-28964e6bf2c0';
    public const INVALID_SECRET = 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEu';
    public const INVALID_KEY = 'invalid';
    public const EMPTY_KEY = 'empty';
    public const TOKEN_TTL = 300;
    public const ENV = 'test';

    private Request $currentRequest;
    /** @var RequestStack|MockObject */
    private RequestStack $requestStack;
    /** @var LoggerInterface|MockObject */
    private LoggerInterface $logger;

    protected function setUp(): void
    {
        ($this->currentRequest = new Request())
            ->initialize([], [], [], [], [], ['REMOTE_ADDR' => '127.0.0.1', 'HTTP_Key' => self::HEADER_KEY, 'HTTP_User-Agent' => 'PHPUnit'])
    ;

        $this->requestStack = $this->getMockBuilder(RequestStack::class)->getMock();
        $this->requestStack->method('getCurrentRequest')->willReturn($this->currentRequest);
        $this->logger = $this->getMockBuilder(LoggerInterface::class)->getMock();
    }

    /**
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function testCalculateTokenMaxLifeTime(): void
    {
        ClockMock::register(TokenManager::class);

        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE, TokenManager::DEFAULT_CIPHER, self::ENV, self::TOKEN_TTL);
        $tokenTtl = $tokenManager->calculateTokenMaxLifeTime();
        $this->assertSame(time() - TokenManager::TOKEN_LIFETIME_DELTA + self::TOKEN_TTL, $tokenTtl);
    }

    public function testCreateTokenSecret(): string
    {
        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE);
        $secret = $tokenManager->createTokenSecret();
        $isBase64 = base64_decode($secret);
        $this->assertNotFalse($isBase64);

        return $secret;
    }

    /**
     * @depends testCreateTokenSecret
     */
    public function testCheckTokenSecret(string $b64Secret): void
    {
        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE);
        $isValid = $tokenManager->checkTokenSecret($b64Secret);
        $this->assertTrue($isValid);
    }

    public function testCheckTokenSecretInvalid(): void
    {
        $this->logger->expects($this->once())->method('warning');

        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE);
        $isValid = $tokenManager->checkTokenSecret(self::INVALID_SECRET);
        $this->assertFalse($isValid);
    }

    public function testGetClientSaltFromRequestSuccess(): void
    {
        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE);
        $salt = $tokenManager->getClientSaltFromRequest();
        $this->assertSame(self::HEADER_KEY, $salt);
    }

    public function testGetClientSaltFromRequestInvalid(): void
    {
        $this->currentRequest->initialize([], [], [], [], [], ['HTTP_Key' => 'foo']);

        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE);
        $salt = $tokenManager->getClientSaltFromRequest();
        $this->assertSame(self::INVALID_KEY, $salt);
    }

    public function testGetClientSaltFromRequestEmpty(): void
    {
        $this->currentRequest->initialize();

        $tokenManager = new TokenManager($this->requestStack, $this->logger, self::JWT_PASSPHRASE);
        $salt = $tokenManager->getClientSaltFromRequest();
        $this->assertSame(self::EMPTY_KEY, $salt);
    }
}
