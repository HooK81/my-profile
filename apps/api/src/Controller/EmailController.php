<?php

declare(strict_types=1);

namespace App\Controller;

use App\Exception\FormException;
use App\Form\MailType;
use App\Mailer\AppMailer;
use App\Message\SendTeamEmailMessage;
use App\ReCaptcha\ReCaptchaValidator;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * EmailController.
 *
 * @Route(
 *     path="/{_locale}/{version}",
 *     requirements={ "_locale": "%app.locales%" },
 *     options={ "expose": true },
 *     defaults={ "_locale": "%app.default_locale%", "version": "v1"}
 * )
 */
class EmailController extends AbstractFOSRestController
{
    private ReCaptchaValidator $reCaptchaValidator;
    private MessageBusInterface $bus;
    private string $mailSubject;
    private string $mailSubjectPrefix;
    private string $mailTimeZone;

    public function __construct(ReCaptchaValidator $reCaptchaValidator, MessageBusInterface $bus)
    {
        $this->reCaptchaValidator = $reCaptchaValidator;
        $this->bus = $bus;
    }

    /**
     * Inject env vars for sending mail
     */
    public function setMailEnvVars(string $mailSubject, string $mailSubjectPrefix, string $mailTimeZone)
    {
        $this->mailSubject = $mailSubject;
        $this->mailSubjectPrefix = $mailSubjectPrefix;
        $this->mailTimeZone = $mailTimeZone;
    }

    /**
     * @Rest\Post(path="/email", name="post_email")
     * @Rest\View(statusCode=204)
     */
    public function postEmail(Request $request): void
    {
        $msg = json_decode($request->getContent(), true);
        $form = $this->createForm(MailType::class);
        $form->submit($msg);
        if (!$form->isValid()) {
            throw new FormException($form);
        }

        $mailData = $form->getNormData();
        $captchaResponse = $this->reCaptchaValidator->checkReCaptchaResponse($mailData['reCaptchaAction'], $mailData['reCaptchaToken']);
        if (!$captchaResponse->isSuccess()) {
            $form->addError(new FormError($captchaResponse->getMessage()));
            throw new FormException($form);
        }

        if (empty($mailData['subject'])) {
            $mailData['subject'] = $this->mailSubject;
        }

        $body = $this->renderView(
            'emails/contact.text.twig', [
                'msg' => $mailData,
                'timezone' => $this->mailTimeZone,
                'locale' => $request->getLocale(),
            ]
        );
        $subject = sprintf('%s %s', trim($this->mailSubjectPrefix), $mailData['subject']);

        $this->bus->dispatch(new SendTeamEmailMessage($subject, $body, AppMailer::MAILER_CONTENT_TYPE_TEXT, $mailData['from']));
    }
}
