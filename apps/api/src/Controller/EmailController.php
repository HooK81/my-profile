<?php

declare(strict_types=1);

namespace App\Controller;

use App\Enum\MailContentType;
use App\Exception\FormException;
use App\Form\MailType;
use App\Message\SendTeamEmailMessage;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route(
    path: '/{_locale}/{version}',
    requirements: ['_locale' => '%app.locales%'],
    options: ['expose' => true],
    defaults: ['_locale' => '%app.default_locale%', 'version' => 'v1']
)]
class EmailController extends AbstractFOSRestController
{
    private string $mailSubjectPrefix;
    private string $mailTimeZone;

    public function __construct(private MessageBusInterface $bus)
    {
    }

    /**
     * Inject env vars for sending mail
     */
    public function setMailEnvVars(string $mailSubjectPrefix, string $mailTimeZone)
    {
        $this->mailSubjectPrefix = $mailSubjectPrefix;
        $this->mailTimeZone = $mailTimeZone;
    }

    #[Rest\Post(path: '/email', name: 'post_email')]
    #[Rest\View(statusCode: 204)]
    public function postEmail(Request $request): void
    {
        $msg = json_decode($request->getContent(), true);
        $form = $this->createForm(MailType::class);
        $form->submit($msg);
        if (!$form->isValid()) {
            throw new FormException($form);
        }
        $mailData = $form->getNormData();

        $body = $this->renderView(
            'emails/contact.text.twig', [
                'msg' => $mailData,
                'timezone' => $this->mailTimeZone,
                'locale' => $request->getLocale(),
            ]
        );
        $subject = sprintf('%s %s', trim($this->mailSubjectPrefix), $mailData['subject']);

        $this->bus->dispatch(new SendTeamEmailMessage($subject, $body, MailContentType::Text, $mailData['from']));
    }
}
