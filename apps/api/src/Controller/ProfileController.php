<?php

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
 *     "/{_locale}/{version}/users",
 *     requirements={ "_locale" = "%app.locales%" },
 *     options={ "expose" = true },
 *     defaults={ "_locale" = "%app.default_locale%", "version" = "v1"}
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
        $this->request = $requestStack->getMasterRequest();
    }

    /**
     * Get a user profile.
     *
     * @Rest\Get("/{id}", name="get_user")
     * @Rest\View()
     *
     * @param string $id
     */
    public function getUserProfile($id): Profile
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
     * @Rest\Get("/{id}/files/{file}", name="get_user_file")
     *
     * @param string $id
     * @param string $file
     */
    public function getUserFile($id, $file): BinaryFileResponse
    {
        $filename = $this->profileManager->getFilesPath($id, $file);
        if (null === $filename) {
            // not found
            throw new NotFoundHttpException(sprintf('file %s not found', $file));
        }
        BinaryFileResponse::trustXSendfileTypeHeader();
        $response = new BinaryFileResponse($filename);
        $response->setMaxAge(9600);

        $disposition = $this->request->get('disposition');
        if ('attachment' === $disposition) {
            $response->setContentDisposition('attachment', $file);
        }

        return $response;
    }

    /**
     * Get a user vcard.
     *
     * @Rest\Get("/{id}/vcard", name="get_user_vcard")
     *
     * @param string $id
     */
    public function getUserVCard($id): Response
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
