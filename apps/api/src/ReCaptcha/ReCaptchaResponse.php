<?php

declare(strict_types=1);

namespace App\ReCaptcha;

/**
 * ReCaptcha Response
 */
class ReCaptchaResponse
{
    public const MSG_SCORE_TOO_LOW = 'reCaptcha score too low.';
    public const MSG_INVALID_TOKEN = 'invalid reCaptcha token.';
    public const MSG_INVALID_ACTION = 'invalid reCaptcha action.';
    public const MSG_INVALID_RESPONSE = 'invalid reCaptcha response.';
    public const MSG_UNKNOWN = 'unknown reCaptcha response';

    private bool $sucess;
    private string $message;
    private string $originalMessage;

    public function __construct(bool $success, string $message, $originalMessage)
    {
        $this->sucess = $success;
        $this->message = $message;
        $this->originalMessage = $originalMessage;
    }

    public function isSuccess(): bool
    {
        return $this->sucess;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function getOriginalMessage(): string
    {
        return $this->originalMessage;
    }
}
