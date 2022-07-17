<?php

declare(strict_types=1);

namespace App\Message;

use App\Enum\MailContentType;

/**
 * SendTeamEmailMessage
 *
 * This message is used to send an email to the team
 *
 * @see SendEmailMessageHandler
 */
class SendTeamEmailMessage extends SendEmailMessage
{
    public function __construct(string $subject, string $body, MailContentType $contentType = MailContentType::Html, ?string $from = null)
    {
        parent::__construct($subject, $body, null, $contentType, $from);
    }
}
