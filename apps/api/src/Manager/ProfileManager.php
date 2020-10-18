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

    /** @var SerializerInterface */
    protected $serializer;
    /** @var Request */
    protected $request;

    /**
     * @param string $usersPath
     */
    public function __construct(RequestStack $requestStack, SerializerInterface $serialize, $usersPath)
    {
        $this->usersPath = $usersPath;
        $this->serializer = $serialize;
        $this->request = $requestStack->getMasterRequest();
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
        $filename = $this->getPath($id).sprintf(self::PROFILE_FILANAME, $this->request->getLocale());
        if (!file_exists($filename)) {
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
