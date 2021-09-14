<?php

declare(strict_types=1);

namespace App\Message;

use App\Mailer\AppMailer;

/**
 * SendEmailMessage
 *
 * This message is used to send an email.
 *
 * @see SendEmailMessageHandler
 */
class SendEmailMessage
{
    private string $subject;
    private string $body;
    private ?string $to;
    private ?string $cc;
    private ?string $cci;
    private ?string $from;
    private ?string $replyTo;
    private string $contentType;

    /**
     *  @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(string $subject, string $body, ?string $to, string $contentType = AppMailer::MAILER_CONTENT_TYPE_HTML, ?string $from = null, ?string $cc = null, ?string $cci = null, ?string $replyTo = null)
    {
        $this->to = $to;
        $this->subject = $subject;
        $this->body = $body;
        $this->contentType = $contentType;
        $this->from = $from;
        $this->cc = $cc;
        $this->cci = $cci;
        $this->replyTo = $replyTo;
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

    public function getContentType(): string
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
