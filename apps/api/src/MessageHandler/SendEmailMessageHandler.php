<?php

declare(strict_types=1);

namespace App\MessageHandler;

use App\Mailer\AppMailer;
use App\Message\SendEmailMessage;
use App\Message\SendTeamEmailMessage;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

/**
 * SendEmailMessageHandler.
 * Process messages SendEmailMessage and SendETeammailMessage
 *
 * Pass the message data to the Mailer service
 */
final class SendEmailMessageHandler implements MessageHandlerInterface
{
    public function __construct(private AppMailer $mailer)
    {
    }

    public function __invoke(SendEmailMessage $message)
    {
        if ($message instanceof SendTeamEmailMessage) {
            $this->mailer->sendMailToTeam($message->getSubject(), $message->getBody(), $message->getContentType(), $message->getFrom());
        } else {
            $this->mailer->sendMail($message->getTo(), $message->getSubject(), $message->getBody(), $message->getContentType(), $message->getFrom(), $message->getReplyTo());
        }
    }
}
