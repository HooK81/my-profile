<?php

namespace App\Mailer;

interface MailerInterface
{
    /**
     * Send an email.
     *
     * @param string $to
     * @param string $subject
     * @param string $body
     * @param string $contentType
     * @param string $from
     */
    public function sendMail($to, $subject, $body, $contentType = 'text/html', $from = null): bool;

    /**
     * Send an email to the team.
     *
     * @param string $subject
     * @param string $body
     * @param string $contentType
     */
    public function sendMailToTeam($subject, $body, $contentType = 'text/html'): bool;
}
