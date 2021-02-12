<?php

namespace App\Mailer;

interface MailerInterface
{
    /**
     * Send an email.
     *
     * @param string $to
     * @param string $object
     * @param string $body
     * @param string $contentType
     * @param string $from
     */
    public function sendMail($to, $object, $body, $contentType = 'text/html', $from = null): bool;

    /**
     * Send an email to the team.
     *
     * @param string $object
     * @param string $body
     * @param string $contentType
     */
    public function sendMailToTeam($object, $body, $contentType = 'text/html'): bool;
}
