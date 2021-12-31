<?php

declare(strict_types=1);

namespace App\Tests\ReCaptcha;

use App\ReCaptcha\ReCaptchaResponse;
use App\ReCaptcha\ReCaptchaResponseFactory;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\Translation\TranslatorInterface;

final class ReCaptchaResponseFactoryTest extends TestCase
{
    public const ORIGINAL = 'original';
    public const TRANSLATED = 'translated';
    public const SUCCESS = true;

    private ReCaptchaResponseFactory $factory;
    /** @var TranslatorInterface|MockObject */
    private TranslatorInterface $translator;

    protected function setUp(): void
    {
        $this->translator = $this->getMockBuilder(TranslatorInterface::class)->getMock();
        $this->factory = new ReCaptchaResponseFactory($this->translator);
        $this->translator->method('trans')->willReturn(self::TRANSLATED);
    }

    public function testFactory(): void
    {
        $this->translator->method('trans')->willReturn(self::TRANSLATED);

        $response = $this->factory->factory(self::SUCCESS, self::ORIGINAL);
        $this->assertInstanceOf(ReCaptchaResponse::class, $response);
    }
}
