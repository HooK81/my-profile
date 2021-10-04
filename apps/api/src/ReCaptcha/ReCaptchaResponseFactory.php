<?php

declare(strict_types=1);

namespace App\ReCaptcha;

use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * ReCaptcha Response Factory
 */
class ReCaptchaResponseFactory
{
    private const TRANSLATION_KEY = [
        ReCaptchaResponse::MSG_SCORE_TOO_LOW => 'recaptcha.score.too_low',
        ReCaptchaResponse::MSG_INVALID_TOKEN => 'recaptcha.token.invalid',
        ReCaptchaResponse::MSG_INVALID_ACTION => 'recaptcha.action.invalid',
        ReCaptchaResponse::MSG_INVALID_RESPONSE => 'recaptcha.response.invalid',
        ReCaptchaResponse::MSG_UNKNOWN => 'recaptcha.response.unknown',
    ];

    private TranslatorInterface $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function factory(bool $success, string $message = ''): ReCaptchaResponse
    {
        $translatedMessage = $this->translator->trans(self::TRANSLATION_KEY[$message] ?? self::TRANSLATION_KEY[ReCaptchaResponse::MSG_UNKNOWN], [], 'validators');

        return new ReCaptchaResponse($success, $translatedMessage, $message);
    }
}
