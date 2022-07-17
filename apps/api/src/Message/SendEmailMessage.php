<?php

declare(strict_types=1);

namespace App\Message;

use App\Enum\MailContentType;

/**
 * SendEmailMessage
 *
 * This message is used to send an email.
 *
 * @see SendEmailMessageHandler
 */
class SendEmailMessage
{
    /**
     *  @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        private string $subject,
        private string $body,
        private ?string $to,
        private MailContentType $contentType = MailContentType::Html,
        private ?string $from = null,
        private ?string $cc = null,
        private ?string $cci = null,
        private ?string $replyTo = null
    ) {
    }

    public function getTo(): string
    {
        return $this->to;
    }

    public function getSubject(): string
    {
        return $this->subject;
    }

    public function getBody(): string
    {
        return $this->body;
    }

    public function getContentType(): MailContentType
    {
        return $this->contentType;
    }

    public function getFrom(): ?string
    {
        return $this->from;
    }

    public function getCc(): ?string
    {
        return $this->cc;
    }

    public function getCci(): ?string
    {
        return $this->cci;
    }

    public function getReplyTo(): ?string
    {
        return $this->replyTo;
    }
}
