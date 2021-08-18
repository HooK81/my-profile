<?php

declare(strict_types=1);

namespace App\Controller;

use App\Exception\FormException;
use App\Form\MailType;
use App\Mailer\MailerInterface;
use App\Security\ReCaptchaValidator;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;
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
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class EmailController extends AbstractFOSRestController
{
    private MailerInterface $mailer;
    private ReCaptchaValidator $reCaptchaValidator;
    private string $mailSubject;
    private string $mailSubjectPrefix;
    private string $mailTimeZone;

    public function __construct(MailerInterface $mailer, ReCaptchaValidator $reCaptchaValidator)
    {
        $this->mailer = $mailer;
        $this->reCaptchaValidator = $reCaptchaValidator;
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
        if (!$this->reCaptchaValidator->checkReCaptchaResponse($msg['reCaptchaResponse'])) {
            throw new NotAcceptableHttpException('Invalid reCaptcha response provided');
        }
        if (empty($msg['subject'])) {
            $msg['subject'] = $this->mailSubject;
        }

        $body = $this->renderView(
            'emails/contact.text.twig', [
                'msg' => $msg,
                'timezone' => $this->mailTimeZone,
            ]
        );
        $subject = sprintf('%s %s', trim($this->mailSubjectPrefix), $msg['subject']);

        $res = $this->mailer->sendMailToTeam($subject, $body, 'text/plain');
        if (false === $res) {
            throw new ConflictHttpException('The e-mail message cannot be sent. Make sure the e-mail has a valid recipient.');
        }
    }
}
