<?php

declare(strict_types=1);

namespace App\Mailer;

interface MailerInterface
{
    /**
     * Send an email.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function sendMail(string $to, string $subject, string $body, string $contentType = 'text/html', string $from = null): bool;

    /**
     * Send an email to the team.
     */
    public function sendMailToTeam(string $subject, string $body, string $contentType = 'text/html'): bool;
}
