<?php

declare(strict_types=1);

namespace App\Mailer;

use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class AppMailer
{
    public const MAILER_CONTENT_TYPE_TEXT = 'text';
    public const MAILER_CONTENT_TYPE_HTML = 'html';
    private string $defaultSenderMail;
    private string $teamMail;
    private LoggerInterface $mainLogger;
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer, LoggerInterface $mainLogger, string $defaultSenderMail, string $teamMail)
    {
        $this->mailer = $mailer;
        $this->mainLogger = $mainLogger;
        $this->defaultSenderMail = $defaultSenderMail;
        $this->teamMail = $teamMail;
    }

    /**
     * Send an email.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function sendMail(string $to, string $subject, string $body, string $contentType = self::MAILER_CONTENT_TYPE_HTML, string $from = null, string $replyTo = null): void
    {
        $from = $from ?? $this->defaultSenderMail;

        $email = (new Email())
            ->from($from)
            ->to($to)
            ->subject($subject)
        ;
        if ($replyTo) {
            $email->replyTo($replyTo);
        }
        if (self::MAILER_CONTENT_TYPE_TEXT === $contentType) {
            $email->text($body);
        } else {
            $email->html($body);
        }

        try {
            $this->mailer->send($email);
            $this->mainLogger->info('[Mailer][sendMail] Mail sent', ['from' => $from, 'to' => $to]);
        } catch (TransportExceptionInterface $e) {
            $this->mainLogger->error('[Mailer][sendMail] Mail not sent', ['from' => $from, 'to' => $to, 'e' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Send an email to the team.
     */
    public function sendMailToTeam(string $subject, string $body, string $contentType = self::MAILER_CONTENT_TYPE_HTML, ?string $from = null): void
    {
        $this->sendMail($this->teamMail, $subject, $body, $contentType, null, $from);
    }
}
