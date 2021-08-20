<?php

declare(strict_types=1);

namespace App\Mailer;

use Psr\Log\LoggerInterface;
use Swift_Message;

class Mailer implements MailerInterface
{
    private string $defaultSenderMail;
    private string $teamMail;
    private \Swift_Mailer $mailer;
    private LoggerInterface $logger;

    public function __construct(\Swift_Mailer $mailer, LoggerInterface $appLogger, $defaultSenderMail, $teamMail)
    {
        $this->mailer = $mailer;
        $this->logger = $appLogger;
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
        $from = $from ?? $this->defaultSenderMail;
        $mail = (new Swift_Message($subject))
        ->setFrom($from)
        ->setTo($to)
        ->setBody(
            $body,
            $contentType
        )
        ;
        $failedRecipients = [];
        $res = $this->mailer->send($mail, $failedRecipients) > 0;
        if (!$res) {
            $this->logger->error('[Mailer][sendMail] Mail not sent', ['from' => $from, 'to' => $to, 'failedReciîents' => $failedRecipients]);
        }

        return $res;
    }

    /**
     * Send an email to the team.
     */
    public function sendMailToTeam(string $subject, string $body, string $contentType = 'text/html'): bool
    {
        return $this->sendMail($this->teamMail, $subject, $body, $contentType);
    }
}
