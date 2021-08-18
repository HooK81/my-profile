<?php

declare(strict_types=1);

namespace App\Generator;

use App\Entity\Profile;
use App\Entity\VCFCard;
use App\Manager\ProfileManager;
use Sabre\VObject\Component\VCard;
use Symfony\Component\HttpFoundation\File\File;

/**
 * VCardGenerator.
 * Generate a VCard 3.0 stream based on a user profile.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class VCardGenerator
{
    private ProfileManager $profileManager;

    public function __construct(ProfileManager $profileManager)
    {
        $this->profileManager = $profileManager;
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
        $file = new File($photoFileName);
        $type = $file->getMimeType();
        if (empty($type)) {
            return null;
        }
        $type = strtoupper(str_replace('images/', '', $type));
        $photoRaw = file_get_contents($file->getPathname());
        if (false === $photoRaw) {
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
