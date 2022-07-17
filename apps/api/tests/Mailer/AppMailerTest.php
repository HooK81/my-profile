<?php

declare(strict_types=1);

namespace App\Tests\Mailer;

use App\Enum\MailContentType;
use App\Mailer\AppMailer;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Exception\TransportException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

final class AppMailerTest extends TestCase
{
    private const DEFAULT_SENDER_EMAIL = 'sender@team.com';
    private const TEAM_EMAIL = 'team@team.com';
    /** @var MailerInterface|MockObject */
    private MailerInterface $mailer;
    /** @var LoggerInterface|MockObject */
    private LoggerInterface $logger;
    private AppMailer $appMailer;

    protected function setUp(): void
    {
        $this->mailer = $this->getMockBuilder(MailerInterface::class)->getMock();
        $this->logger = $this->getMockBuilder(LoggerInterface::class)->getMock();
        $this->appMailer = new AppMailer($this->mailer, $this->logger, self::DEFAULT_SENDER_EMAIL, self::TEAM_EMAIL);
    }

    public function testSendHtmlMailSuccess()
    {
        $this->mailer->expects($this->once())
            ->method('send')
            ->with(
                $this->callback(function (Email $email) {
                    $this->assertSame('john@doe.com', $email->getTo()[0]->getAddress());
                    $this->assertSame('subject', $email->getSubject());
                    $this->assertSame('body', $email->getHtmlBody());
                    $this->assertSame(self::DEFAULT_SENDER_EMAIL, $email->getFrom()[0]->getAddress());
                    $this->assertEmpty($email->getReplyTo());

                    return true;
                })
            )
        ;
        $this->logger->expects($this->once())
            ->method('info')
        ;

        $this->appMailer->sendMail('john@doe.com', 'subject', 'body', MailContentType::Html, null, null);
    }

    public function testSendTextMailSuccessWithFromAndReply()
    {
        $this->mailer->expects($this->once())
            ->method('send')
            ->with(
                $this->callback(function (Email $email) {
                    $this->assertSame('body', $email->getTextBody());
                    $this->assertSame('custom@from.com', $email->getFrom()[0]->getAddress());
                    $this->assertSame('reply@to.com', $email->getReplyTo()[0]->getAddress());

                    return true;
                })
            )
        ;

        $this->appMailer->sendMail('john@doe.com', 'subject', 'body', MailContentType::Text, 'custom@from.com', 'reply@to.com');
    }

    public function testSendMailException()
    {
        $this->expectException(TransportException::class);

        $this->mailer->expects($this->once())
            ->method('send')
            ->willThrowException(new TransportException('test'))
        ;

        $this->logger->expects($this->once())
            ->method('error')
        ;

        $this->appMailer->sendMail('john@doe.com', 'subject', 'body');
    }

    public function testSendMailToTeam()
    {
        $this->mailer->expects($this->once())
            ->method('send')
            ->with(
                $this->callback(function (Email $email) {
                    $this->assertSame(self::TEAM_EMAIL, $email->getTo()[0]->getAddress());
                    $this->assertSame('subject', $email->getSubject());
                    $this->assertSame('body', $email->getHtmlBody());
                    $this->assertSame(self::DEFAULT_SENDER_EMAIL, $email->getFrom()[0]->getAddress());

                    return true;
                })
            )
        ;
        $this->logger->expects($this->once())
            ->method('info')
        ;

        $this->appMailer->sendMailToTeam('subject', 'body');
    }
}
