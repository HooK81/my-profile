<?php

declare(strict_types=1);

namespace App\Generator;

use App\Entity\Profile;
use App\Entity\VCFCard;
use App\Manager\ProfileManager;
use Psr\Log\LoggerInterface;
use Sabre\VObject\Component\VCard;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\File;

/**
 * VCardGenerator.
 * Generate a VCard 3.0 stream based on a user profile.
 */
class VCardGenerator
{
    private ProfileManager $profileManager;
    private LoggerInterface $mainLogger;

    public function __construct(ProfileManager $profileManager, LoggerInterface $mainLogger)
    {
        $this->profileManager = $profileManager;
        $this->mainLogger = $mainLogger;
    }

    public function generateProfileVCard(Profile $profile): VCFCard
    {
        $vcard = new VCard([
            'VERSION' => '3.0',
            'N' => [$profile->getMain()->getLastName(), $profile->getMain()->getFirstName()],
            'FN' => $profile->getMain()->getFullName(),
            'TEL;TYPE=cell;type=pref' => $this->cleanPhone($profile->getMain()->getPhone()),
            'EMAIL;type=INTERNET;type=HOME;type=pref' => $profile->getMain()->getEmail(),
            'URL;type=pref' => $profile->getMain()->getWebsite(),
        ]);
        $photo = $this->getPhotoInfo($profile);
        if (\is_array($photo)) {
            $vcard->add('PHOTO', $photo['data'], ['ENCODING' => 'b', 'TYPE' => $photo['type']]);
        }

        return new VCFCard(
            $this->getVCardFilename($profile),
            $vcard->serialize()
        );
    }

    /**
     * Remove parenthesis from phone number.
     */
    private function cleanPhone(string $phone): string
    {
        $formated = preg_replace("/\([^)]+\)/", '', $phone);
        $formated = str_replace(' ', '', $formated);

        return $formated;
    }

    /**
     * Get photo data.
     */
    private function getPhotoInfo(Profile $profile): ?array
    {
        $photoFileName = $this->profileManager->getFilesPath($profile->getId(), $profile->getMain()->getImage());
        if (null === $photoFileName) {
            return null;
        }
        try {
            $file = new File($photoFileName);
            $type = $file->getMimeType();
            // @codeCoverageIgnoreStart
            if (empty($type)) {
                $this->mainLogger->warning('[VCardGenerator][GetPhotoInfo] Unable to determine MimeType', ['profileId' => $profile->getId(), 'filename' => $photoFileName]);

                return null;
            }
            // @codeCoverageIgnoreEnd
            $type = strtoupper(str_replace('images/', '', $type));
            $photoRaw = $file->getContent();
        } catch (FileException $e) {
            $this->mainLogger->error('[VCardGenerator][GetPhotoInfo] Unable to read the photo file', ['profileId' => $profile->getId(), 'filename' => $photoFileName, 'exception' => $e]);

            return null;
        }

        return [
            'type' => $type,
            'data' => $photoRaw,
        ];
    }

    /**
     * Get VCard filename.
     */
    private function getVCardFilename(Profile $profile): string
    {
        $name = sprintf('%s.vcf', $profile->getMain()->getFullName());
        $name = str_replace(' ', '_', $name);

        return $name;
    }
}
