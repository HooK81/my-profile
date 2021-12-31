<?php

declare(strict_types=1);

namespace App\Tests\Generator;

use App\Entity\Profile;
use App\Entity\VCFCard;
use App\Generator\VCardGenerator;
use App\Manager\ProfileManager;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Sabre\VObject;

final class VCardGeneratorTest extends TestCase
{
    public const PHOTO_PATH = __DIR__ . '/__mocks__/profile.jpg';
    private VCardGenerator $generator;
    /** @var ProfileManager|MockObject */
    private ProfileManager $profileManager;
    /** @var LoggerInterface|MockObject */
    private LoggerInterface $logger;
    private Profile $profile;

    protected function setUp(): void
    {
        $this->profileManager = $this->getMockBuilder(ProfileManager::class)->disableOriginalConstructor()->getMock();
        $this->logger = $this->getMockBuilder(LoggerInterface::class)->getMock();
        $this->loadProfile();
        $this->generator = new VCardGenerator($this->profileManager, $this->logger);
    }

    private function loadProfile()
    {
        $this->profile = new Profile();
        $this->profile->setId('USER_ID');
        $this->profile->getMain()->setFirstName('firstname');
        $this->profile->getMain()->setLastName('lastname');
        $this->profile->getMain()->setFullName('fullname');
        $this->profile->getMain()->setPhone('+33333333333');
        $this->profile->getMain()->setEmail('foo@bar.com');
        $this->profile->getMain()->setWebsite('https://foo.bar');
        $this->profile->getMain()->setImage('profile.jpg');
    }

    /**
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function testGenerateProfileVCard(): void
    {
        $this->profileManager->expects($this->once())
            ->method('getFilesPath')
            ->willReturn(self::PHOTO_PATH)
        ;
        $vcfCard = $this->generator->generateProfileVCard($this->profile);
        $this->assertInstanceOf(VCFCard::class, $vcfCard);
        $this->assertSame('fullname.vcf', $vcfCard->getFilename());

        $vcard = VObject\Reader::read($vcfCard->getVCFStream());
        $this->assertSame('fullname', (string) $vcard->FN);
        $this->assertStringContainsString('lastname', (string) $vcard->N);
        $this->assertStringContainsString('firstname', (string) $vcard->N);
        $this->assertSame('+33333333333', (string) $vcard->TEL);
        $this->assertSame('foo@bar.com', (string) $vcard->EMAIL);
        $this->assertSame('https://foo.bar', (string) $vcard->URL);
        $this->assertNotEmpty((string) $vcard->PHOTO);
    }

    /**
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function testGenerateProfileVCardWithoutPhoto(): void
    {
        $vcfCard = $this->generator->generateProfileVCard($this->profile);
        $this->assertInstanceOf(VCFCard::class, $vcfCard);
        $vcard = VObject\Reader::read($vcfCard->getVCFStream());
        $this->assertEmpty((string) $vcard->PHOTO);
    }

    /**
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function testGenerateProfileVCardFileNotExistsError(): void
    {
        $this->profileManager->expects($this->once())
            ->method('getFilesPath')
            ->willReturn('does.not.exists')
        ;
        $this->logger->expects($this->once())
            ->method('error')
            ->with('[VCardGenerator][GetPhotoInfo] Unable to read the photo file')
        ;
        $vcfCard = $this->generator->generateProfileVCard($this->profile);
        $this->assertInstanceOf(VCFCard::class, $vcfCard);
        $vcard = VObject\Reader::read($vcfCard->getVCFStream());
        $this->assertEmpty((string) $vcard->PHOTO);
    }
}
