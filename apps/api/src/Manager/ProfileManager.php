<?php

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
    const FILES_FOLDER = 'files/';
    const PROFILE_FILANAME = 'profile.%s.json';

    /** @var string */
    protected $usersPath;
    /** @var string */
    protected $defaultLocale;
    /** @var SerializerInterface */
    protected $serializer;
    /** @var Request */
    protected $request;

    /**
     * @param string $usersPath
     * @param string $defaultLocale
     */
    public function __construct(RequestStack $requestStack, SerializerInterface $serialize, $usersPath, $defaultLocale)
    {
        $this->request = $requestStack->getMasterRequest();
        $this->serializer = $serialize;
        $this->usersPath = $usersPath;
        $this->defaultLocale = $defaultLocale;
    }

    /**
     * Return user path.
     *
     * @param string $id
     *
     * @return string
     */
    public function getPath($id)
    {
        return $this->usersPath.$id.'/';
    }

    /**
     * Return user files path.
     *
     * @param string $id
     * @param string $file
     *
     * @return string
     */
    public function getFilesPath($id, $file)
    {
        $filename = $this->getPath($id).self::FILES_FOLDER.$file;
        if (!file_exists($filename)) {
            $pathInfo = pathinfo($filename);
            $locale = $this->request->getLocale();
            $filename = $pathInfo['dirname'].'/'.$pathInfo['filename'].'.'.$locale.'.'.$pathInfo['extension'];
        }
        if (!file_exists($filename)) {
            $filename = null;
        }

        return $filename;
    }

    /**
     * Load Profile from id.
     *
     * @param string $id
     *
     * @return Profile
     */
    public function getProfile($id)
    {
        $locales = [$this->request->getLocale(), $this->defaultLocale];
        $found = false;
        foreach ($locales as $locale) {
            $filename = $this->getPath($id).sprintf(self::PROFILE_FILANAME, $locale);
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
