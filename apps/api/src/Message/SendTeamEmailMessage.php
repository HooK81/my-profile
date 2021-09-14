<?php

declare(strict_types=1);

namespace App\Message;

use App\Mailer\AppMailer;

/**
 * SendTeamEmailMessage
 *
 * This message is used to send an email to the team
 *
 * @see SendEmailMessageHandler
 */
class SendTeamEmailMessage extends SendEmailMessage
{
    public function __construct(string $subject, string $body, string $contentType = AppMailer::MAILER_CONTENT_TYPE_HTML, ?string $from = null)
    {
        parent::__construct($subject, $body, null, $contentType, $from);
    }
}
