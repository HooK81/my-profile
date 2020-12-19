<?php

namespace App\Controller;

use App\Entity\Profile;
use App\Manager\ProfileManager;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * ProfileController.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class ProfileController extends AbstractFOSRestController
{
    /** @var ProfileManager */
    protected $profileManager;
    /** @var Request */
    protected $request;

    public function __construct(RequestStack $requestStack, ProfileManager $profileManager)
    {
        $this->profileManager = $profileManager;
        $this->request = $requestStack->getMasterRequest();
    }

    /**
     * Get a user profile.
     *
     * @Rest\Get("/users/{id}", name="get_user", options={ "method_prefix" = false })
     * @Rest\View()
     *
     * @param string $id
     */
    public function getUserAction($id)
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
     * @Rest\Get("/users/{id}/files/{file}", name="get_user_file", options={ "method_prefix" = false })
     *
     * @param string $id
     * @param string $file
     *
     * @return BinaryFileResponse
     */
    public function getUserFileAction($id, $file)
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
}
