<?php

namespace App\Controller;

use App\Security\ReCaptchaValidator;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotAcceptableHttpException;

/**
 * EmailController.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class EmailController extends AbstractFOSRestController
{
    private $mailer;
    private $reCaptchaValidator;
    private $timezone;

    /**
     * @param \Swift_Mailer      $mailer             Mail service
     * @param ReCaptchaValidator $reCaptchaValidator reCaptcha Validator
     * @param string             $timezone           Timezone
     */
    public function __construct(\Swift_Mailer $mailer, ReCaptchaValidator $reCaptchaValidator, $timezone)
    {
        $this->mailer = $mailer;
        $this->reCaptchaValidator = $reCaptchaValidator;
        $this->timezone = $timezone;
    }

    /**
     * @Rest\Post("/email", name="post_email", options={ "method_prefix" = false })
     * @Rest\View(statusCode=204)
     */
    public function postEmailAction(Request $request)
    {
        $msg = json_decode($request->getContent(), true);
        if (empty($msg['reCaptchaResponse'])) {
            throw new NotAcceptableHttpException('No reCaptcha response provided');
        }
        if (!$this->reCaptchaValidator->checkReCaptchaResponse($msg['reCaptchaResponse'])) {
            throw new NotAcceptableHttpException('Invalid reCaptcha response provided');
        }
        if (empty($msg['from']) || empty($msg['message'])) {
            throw new NotAcceptableHttpException('Invalid request');
        }
        if (empty($msg['object'])) {
            $msg['object'] = $_ENV['MAILER_OBJECT_DEFAULT'];
        }

        // send mail
        $mail = (new \Swift_Message($_ENV['MAILER_OBJECT_PREFIX'].$msg['object']))
            ->setFrom($_ENV['MAILER_SENDER'])
            ->setTo($_ENV['MAILER_RECEIVER'])
            ->setBody(
                $this->renderView(
                    'emails/contact.text.twig', [
                        'msg' => $msg,
                        'timezone' => $this->timezone,
                    ]
                ),
                'text/plain'
            );

        $res = $this->mailer->send($mail);
        if (0 === $res) {
            throw new ConflictHttpException('The e-mail message cannot be sent. Make sure the e-mail has a valid recipient.');
        }
    }
}
