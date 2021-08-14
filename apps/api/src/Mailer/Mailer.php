<?php

declare(strict_types=1);

namespace App\Mailer;

use Swift_Message;

class Mailer implements MailerInterface
{
    private string $defaultSenderMail;
    private string $teamMail;
    private \Swift_Mailer $mailer;

    public function __construct(\Swift_Mailer $mailer, $defaultSenderMail, $teamMail)
    {
        $this->mailer = $mailer;
        $this->defaultSenderMail = $defaultSenderMail;
        $this->teamMail = $teamMail;
    }

    /**
     * Send an email.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function sendMail(string $to, string $subject, string $body, string $contentType = 'text/html', string $from = null): bool
    {
        $mail = (new Swift_Message($subject))
        ->setFrom($from ?? $this->defaultSenderMail)
        ->setTo($to)
        ->setBody(
            $body,
            $contentType
        )
        ;

        return $this->mailer->send($mail) > 0;
    }

    /**
     * Send an email to the team.
     */
    public function sendMailToTeam(string $subject, string $body, string $contentType = 'text/html'): bool
    {
        return $this->sendMail($this->teamMail, $subject, $body, $contentType);
    }
}
