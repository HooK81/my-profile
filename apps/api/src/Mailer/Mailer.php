<?php

namespace App\Mailer;

class Mailer implements MailerInterface
{
    /** @var string */
    private $defaultSenderMail;

    /** @var string */
    private $teamMail;

    /** @var \Swift_Mailer */
    private $mailer;

    public function __construct(\Swift_Mailer $mailer, $defaultSenderMail, $teamMail)
    {
        $this->mailer = $mailer;
        $this->defaultSenderMail = $defaultSenderMail;
        $this->teamMail = $teamMail;
    }

    /**
     * Send an email.
     *
     * @param string $to
     * @param string $object
     * @param string $body
     * @param string $contentType
     * @param string $from
     */
    public function sendMail($to, $object, $body, $contentType = 'text/html', $from = null): bool
    {
        $mail = (new \Swift_Message($object))
        ->setFrom($from ?? $this->defaultSenderMail)
        ->setTo($to)
        ->setBody(
            $body,
            $contentType
        );

        return $this->mailer->send($mail) > 0;
    }

    /**
     * Send an email to the team.
     *
     * @param string $object
     * @param string $body
     * @param string $contentType
     */
    public function sendMailToTeam($object, $body, $contentType = 'text/html'): bool
    {
        return $this->sendMail($this->teamMail, $object, $body, $contentType);
    }
}
