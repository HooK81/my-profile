<?php

declare(strict_types=1);

namespace App\Tests\MessageHandler;

use App\Mailer\AppMailer;
use App\Message\SendEmailMessage;
use App\Message\SendTeamEmailMessage;
use App\MessageHandler\SendEmailMessageHandler;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

final class SendEmailMessageHandlerTest extends TestCase
{
    public const SUBJECT = 'subject';
    public const BODY = 'body';
    public const TO = 'john@doe.com';

    private SendEmailMessageHandler $handler;
    /** @var AppMailer|MockObject */
    private AppMailer $mailer;

    protected function setUp(): void
    {
        $this->mailer = $this->getMockBuilder(AppMailer::class)->disableOriginalConstructor()->getMock();
        $this->handler = new SendEmailMessageHandler($this->mailer);
    }

    public function testSendMailToTeam()
    {
        $message = new SendTeamEmailMessage(
            self::SUBJECT,
            self::BODY,
        );
        $invokeHandler = $this->handler;

        $this->mailer->expects($this->once())->method('sendMailToTeam');

        $invokeHandler($message);
    }

    public function testSendMail()
    {
        $message = new SendEmailMessage(
            self::SUBJECT,
            self::BODY,
            self::TO,
        );
        $invokeHandler = $this->handler;

        $this->mailer->expects($this->once())->method('sendMail');

        $invokeHandler($message);
    }
}
