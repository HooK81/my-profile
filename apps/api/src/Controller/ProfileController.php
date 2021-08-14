<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Profile;
use App\Generator\VCardGenerator;
use App\Manager\ProfileManager;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * ProfileController.
 *
 * @Route(
 *     path="/{_locale}/{version}/users",
 *     requirements={ "_locale": "%app.locales%" },
 *     options={ "expose": true },
 *     defaults={ "_locale": "%app.default_locale%", "version": "v1"}
 * )
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class ProfileController extends AbstractFOSRestController
{
    /** @var ProfileManager */
    protected $profileManager;
    /** @var VCardGenerator */
    protected $vCardGenerator;
    /** @var Request */
    protected $request;

    public function __construct(RequestStack $requestStack, ProfileManager $profileManager, VCardGenerator $vCardGenerator)
    {
        $this->profileManager = $profileManager;
        $this->vCardGenerator = $vCardGenerator;
        $this->request = $requestStack->getMainRequest();
    }

    /**
     * Get a user profile.
     *
     * @Rest\Get(path="/{id}", name="get_user")
     * @Rest\View
     */
    public function getUserProfile(string $id): Profile
    {
        /** @var Profile $profile */
        $profile = $this->profileManager->getProfile($id);
        if (!$profile) {
            throw new NotFoundHttpException(sprintf('profile [%s] not found', $id));
        }

        return $profile;
    }

    /**
     * Get a user file.
     *
     * @Rest\Get(path="/{id}/files/{file}", name="get_user_file")
     */
    public function getUserFile(string $id, string $file): BinaryFileResponse
    {
        $filename = $this->profileManager->getFilesPath($id, $file);
        if (null === $filename) {
            // not found
            throw new NotFoundHttpException(sprintf('file %s not found', $file));
        }
        $response = new BinaryFileResponse($filename);
        $response->setMaxAge(9600);
        $response->trustXSendfileTypeHeader();

        $disposition = $this->request->get('disposition');
        if ('attachment' === $disposition) {
            $response->setContentDisposition('attachment', $file);
        }

        return $response;
    }

    /**
     * Get a user vcard.
     *
     * @Rest\Get(path="/{id}/vcard", name="get_user_vcard")
     */
    public function getUserVCard(string $id): Response
    {
        $profile = $this->getUserProfile($id);
        $vcard = $this->vCardGenerator->generateProfileVCard($profile);
        $response = new Response($vcard->getVCFStream());
        $response->setMaxAge(9600);
        $response->headers->set('Content-Type', 'text/x-vcard');
        $response->headers->set('Content-Disposition', sprintf('attachment; filename="%s"', $vcard->getFilename()));

        return $response;
    }
}
