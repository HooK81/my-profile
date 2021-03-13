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
     * @param string $subject
     * @param string $body
     * @param string $contentType
     * @param string $from
     */
    public function sendMail($to, $subject, $body, $contentType = 'text/html', $from = null): bool
    {
        $mail = (new \Swift_Message($subject))
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
     * @param string $subject
     * @param string $body
     * @param string $contentType
     */
    public function sendMailToTeam($subject, $body, $contentType = 'text/html'): bool
    {
        return $this->sendMail($this->teamMail, $subject, $body, $contentType);
    }
}
