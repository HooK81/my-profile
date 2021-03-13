<?php

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
 *     "/{_locale}/{version}",
 *     requirements={ "_locale" = "%app.locales%" },
 *     options={ "expose" = true },
 *     defaults={ "_locale" = "%app.default_locale%", "version" = "v1"}
 * )
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class EmailController extends AbstractFOSRestController
{
    private $mailer;
    private $reCaptchaValidator;

    /**
     * @param MailerInterface    $mailer             Mail service
     * @param ReCaptchaValidator $reCaptchaValidator reCaptcha Validator
     */
    public function __construct(MailerInterface $mailer, ReCaptchaValidator $reCaptchaValidator)
    {
        $this->mailer = $mailer;
        $this->reCaptchaValidator = $reCaptchaValidator;
    }

    /**
     * @Rest\Post("/email", name="post_email")
     * @Rest\View(statusCode=204)
     */
    public function postEmail(Request $request)
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
            $msg['subject'] = $_ENV['MAILER_SUBJECT_DEFAULT'];
        }

        $body = $this->renderView(
            'emails/contact.text.twig', [
                'msg' => $msg,
                'timezone' => $_ENV['MAILTER_TIMEZONE'],
            ]
        );
        $subject = sprintf('%s %s', trim($_ENV['MAILER_SUBJECT_PREFIX']), $msg['subject']);

        $res = $this->mailer->sendMailToTeam($subject, $body, 'text/plain');
        if (false === $res) {
            throw new ConflictHttpException('The e-mail message cannot be sent. Make sure the e-mail has a valid recipient.');
        }
    }
}
