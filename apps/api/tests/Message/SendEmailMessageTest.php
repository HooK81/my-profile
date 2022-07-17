<?php

declare(strict_types=1);

namespace App\Tests\Message;

use App\Enum\MailContentType;
use App\Message\SendEmailMessage;
use PHPUnit\Framework\TestCase;

final class SendEmailMessageTest extends TestCase
{
    public const SUBJECT = 'subject';
    public const BODY = 'body';
    public const TO = 'to@customer.com';
    public const FROM = 'from@team.com';
    public const CC = 'cc@team.com';
    public const CCI = 'cci@team.com';
    public const REPLY_TO = 'replyTo@team.com';

    protected SendEmailMessage $message;

    protected function setUp(): void
    {
        $this->message = new SendEmailMessage(
            self::SUBJECT,
            self::BODY,
            self::TO,
            MailContentType::Html,
            self::FROM,
            self::CC,
            self::CCI,
            self::REPLY_TO
        );
    }

    public function testGetters(): void
    {
        $to = $this->message->getTo();
        $this->assertEquals(self::TO, $to);

        $subject = $this->message->getSubject();
        $this->assertEquals(self::SUBJECT, $subject);

        $body = $this->message->getBody();
        $this->assertEquals(self::BODY, $body);

        $contentType = $this->message->getContentType();
        $this->assertEquals(MailContentType::Html, $contentType);

        $from = $this->message->getFrom();
        $this->assertEquals(self::FROM, $from);

        $cc = $this->message->getCc();
        $this->assertEquals(self::CC, $cc);

        $cci = $this->message->getCci();
        $this->assertEquals(self::CCI, $cci);

        $replyTo = $this->message->getReplyTo();
        $this->assertEquals(self::REPLY_TO, $replyTo);
    }
}
