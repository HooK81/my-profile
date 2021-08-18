<?php

declare(strict_types=1);

namespace App\Manager;

use App\Entity\Profile;
use Exception;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * ProfileManager.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class ProfileManager
{
    public const FILES_FOLDER = 'files/';
    public const PROFILE_FILANAME = 'profile.%s.json';

    protected string $usersPath;
    protected string $defaultLocale;
    protected SerializerInterface $serializer;
    protected Request $request;

    public function __construct(RequestStack $requestStack, SerializerInterface $serialize, string $usersPath, string $defaultLocale)
    {
        $this->request = $requestStack->getMainRequest();
        $this->serializer = $serialize;
        $this->usersPath = $usersPath;
        $this->defaultLocale = $defaultLocale;
    }

    /**
     * Return user path.
     */
    public function getPath(string $id): string
    {
        return $this->usersPath . $id . '/';
    }

    /**
     * Return user files path.
     */
    public function getFilesPath(string $id, string $file): ?string
    {
        $filename = $this->getPath($id) . self::FILES_FOLDER . $file;
        if (!file_exists($filename)) {
            $pathInfo = pathinfo($filename);
            $locale = $this->request->getLocale();
            $filename = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '.' . $locale . '.' . $pathInfo['extension'];
        }
        if (!file_exists($filename)) {
            $filename = null;
        }

        return $filename;
    }

    /**
     * Load Profile from id.
     */
    public function getProfile(string $id): ?Profile
    {
        $locales = [$this->request->getLocale(), $this->defaultLocale];
        $found = false;
        foreach ($locales as $locale) {
            $filename = $this->getPath($id) . sprintf(self::PROFILE_FILANAME, $locale);
            if (file_exists($filename)) {
                $found = true;
                break;
            }
        }
        if (!$found) {
            return null;
        }
        $jsonStream = file_get_contents($filename);
        try {
            $profile = $this->serializer->deserialize($jsonStream, Profile::class, 'json');
        } catch (Exception $e) {
            echo $e->getMessage();

            return null;
        }

        return $profile;
    }
}
