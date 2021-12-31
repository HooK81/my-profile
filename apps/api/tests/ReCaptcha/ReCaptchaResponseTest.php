<?php

declare(strict_types=1);

namespace App\Tests\ReCaptcha;

use App\ReCaptcha\ReCaptchaResponse;
use PHPUnit\Framework\TestCase;

final class ReCaptchaResponseTest extends TestCase
{
    public const SUCCESS = true;
    public const MESSAGE = 'message';
    public const ORIGINAL = 'original';

    private ReCaptchaResponse $response;

    protected function setUp(): void
    {
        $this->response = new ReCaptchaResponse(
            self::SUCCESS,
            self::MESSAGE,
            self::ORIGINAL
        );
    }

    public function testGetters(): void
    {
        $success = $this->response->isSuccess();
        $this->assertEquals(self::SUCCESS, $success);

        $message = $this->response->getMessage();
        $this->assertEquals(self::MESSAGE, $message);

        $original = $this->response->getOriginalMessage();
        $this->assertEquals(self::ORIGINAL, $original);
    }
}
