<?php

declare(strict_types=1);

namespace App\Tests\Message;

use App\Entity\Profile;
use App\Manager\ProfileManager;
use Exception;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\SerializerInterface;

final class ProfileManagerTest extends TestCase
{
    public const USERS_PATH = __DIR__ . '/__mocks__/';
    public const USER_ID = 'USER_ID';
    public const FILE = 'file.txt';
    public const FILE2 = 'file2.txt';
    public const FILE2_FIXED = 'file2.en.txt';
    public const FILE_NOT_FOUND = 'notfound.txt';
    public const LOCALE = 'en';
    private Request $currentRequest;
    /** @var RequestStack|MockObject */
    private RequestStack $requestStack;
    /** @var LoggerInterface|MockObject */
    private LoggerInterface $logger;
    /** @var SerializerInterface|MockObject */
    private SerializerInterface $serializer;
    private ProfileManager $manager;

    protected function setUp(): void
    {
        ($this->currentRequest = new Request())->initialize();
        $this->requestStack = $this->getMockBuilder(RequestStack::class)->getMock();
        $this->requestStack->method('getMainRequest')->willReturn($this->currentRequest);
        $this->serializer = $this->getMockBuilder(SerializerInterface::class)->getMock();
        $this->logger = $this->getMockBuilder(LoggerInterface::class)->getMock();

        $this->manager = new ProfileManager(
            $this->requestStack,
            $this->serializer,
            $this->logger,
            self::USERS_PATH,
            self::LOCALE
        );
    }

    public function testGetPath(): void
    {
        $path = $this->manager->getPath(self::USER_ID);
        $this->assertEquals(sprintf('%s%s/', self::USERS_PATH, self::USER_ID), $path);
    }

    public function testGetFilesPath(): void
    {
        $path = $this->manager->getFilesPath(self::USER_ID, self::FILE);
        $this->assertEquals(sprintf('%s%s/%s%s', self::USERS_PATH, self::USER_ID, ProfileManager::FILES_FOLDER, self::FILE), $path);
    }

    public function testGetFilesPathWithLocaleFallback(): void
    {
        $path = $this->manager->getFilesPath(self::USER_ID, self::FILE2);
        $this->assertEquals(sprintf('%s%s/%s%s', self::USERS_PATH, self::USER_ID, ProfileManager::FILES_FOLDER, self::FILE2_FIXED), $path);
    }

    public function testGetFilesPathNotFound(): void
    {
        $this->logger->expects($this->once())->method('error');

        $path = $this->manager->getFilesPath(self::USER_ID, self::FILE_NOT_FOUND);
        $this->assertNull($path);
    }

    public function testGetProfile(): void
    {
        $mockProfile = new Profile();
        $this->serializer->method('deserialize')->willReturn($mockProfile);
        $profile = $this->manager->getProfile(self::USER_ID);

        $this->assertSame($mockProfile, $profile);
    }

    public function testGetProfileNotFound(): void
    {
        $this->logger->expects($this->once())->method('error');
        $profile = $this->manager->getProfile('FOO');

        $this->assertNull($profile);
    }

    public function testGetProfileDeserializationError(): void
    {
        $this->serializer->method('deserialize')->willThrowException(new Exception('foo'));
        $this->logger->expects($this->once())->method('error');

        $profile = $this->manager->getProfile(self::USER_ID);

        $this->assertNull($profile);
    }
}
