<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Mailer\AppMailer;
use App\ReCaptcha\ReCaptchaResponse;
use App\ReCaptcha\ReCaptchaValidator;
use App\Tests\Traits\LoggedUserTrait;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class EmailControllerTest extends WebTestCase
{
    use LoggedUserTrait;

    public const MAIL_DATE_FORMAT = 'd/m/Y H:i';
    public const ERROR_INVALID_FORM = 'Invalid form';

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->setLoggedUser($this->client);
    }

    /**
     * @dataProvider mailDataProvider
     * @SuppressWarnings(PHPMD.Superglobals)
     */
    public function testSendMailSuccess(array $mailData, string $locale, string $mockFile): void
    {
        // Mock ReCaptchaValidator
        $reCaptchaValidatorMock = $this->getMockBuilder(ReCaptchaValidator::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['checkReCaptchaResponse'])
            ->getMock()
        ;
        $reCaptchaValidatorMock->method('checkReCaptchaResponse')->willReturn(new ReCaptchaResponse(true, '', ''));
        static::getContainer()->set('App\ReCaptcha\ReCaptchaValidator', $reCaptchaValidatorMock);

        // Mock AppMailer
        $mailerMock = $this->getMockBuilder(AppMailer::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        static::getContainer()->set('App\Mailer\AppMailer', $mailerMock);
        $mailerMock->expects($this->once())
            ->method('sendMailToTeam')
            ->with(
                $this->stringContains($mailData['subject'] ?? $_ENV['MAILER_SUBJECT_DEFAULT']),
                $this->callback(function (string $body) use ($mockFile) {
                    $now = (new \DateTime('now'))->setTimezone(new \DateTimeZone($_ENV['MAILTER_TIMEZONE']))->format(self::MAIL_DATE_FORMAT);
                    $this->assertEquals(
                        str_replace('%%NOW%%', $now, file_get_contents($mockFile)),
                        $body
                    );

                    return true;
                })
            )
        ;

        $this->client->request(
            'POST',
            "/{$locale}/v1/email",
            [],
            [],
            [],
            json_encode(array_merge([
                'reCaptchaAction' => 'foo',
                'reCaptchaToken' => 'foo',
                'message' => 'message to be sent',
                'from' => 'john@doe.com',
            ], $mailData))
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function mailDataProvider(): array
    {
        return [
            [[], 'en', __DIR__ . '/__mocks__/emailBody1.txt'],
            [['subject' => 'subject of the message'], 'fr', __DIR__ . '/__mocks__/emailBody2.txt'],
        ];
    }

    public function testSendMailCaptchaError(): void
    {
        // Mock ReCaptchaValidator
        $expectedError = 'captcha error';
        $reCaptchaValidatorMock = $this->getMockBuilder(ReCaptchaValidator::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['checkReCaptchaResponse'])
            ->getMock()
        ;
        $reCaptchaValidatorMock->method('checkReCaptchaResponse')->willReturn(new ReCaptchaResponse(false, $expectedError, ''));
        static::getContainer()->set('App\ReCaptcha\ReCaptchaValidator', $reCaptchaValidatorMock);

        $this->client->request(
            'POST',
            '/en/v1/email',
            [],
            [],
            [],
            json_encode([
                'reCaptchaAction' => 'foo',
                'reCaptchaToken' => 'foo',
                'message' => 'message to be sent',
                'subject' => 'subject of the message',
                'from' => 'john@doe.com',
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals([
            'code' => Response::HTTP_BAD_REQUEST,
            'message' => self::ERROR_INVALID_FORM,
            'errors' => [
                ['mail' => [$expectedError]],
            ],
        ], $response);
    }

    /**
     * @dataProvider validationErrorProvider
     */
    public function testSendMailValidationError(array $body, array $errorKeys): void
    {
        $this->client->request(
            'POST',
            '/en/v1/email',
            [],
            [],
            [],
            json_encode($body)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response['code']);
        $this->assertEquals(self::ERROR_INVALID_FORM, $response['message']);
        $this->assertIsArray($response['errors'][0]);
        foreach ($errorKeys as $key) {
            $this->assertArrayHasKey($key, $response['errors'][0]);
        }
    }

    public function validationErrorProvider(): array
    {
        return [
            [[], ['reCaptchaAction', 'reCaptchaToken', 'message', 'from']],
            [
                [
                    'reCaptchaAction' => 'action',
                ],
                ['reCaptchaToken', 'message', 'from'],
            ],
            [
                [
                    'reCaptchaAction' => 'action',
                    'reCaptchaToken' => 'token',
                ],
                ['message', 'from'],
            ],
            [
                [
                    'reCaptchaAction' => 'action',
                    'reCaptchaToken' => 'token',
                    'message' => 'too short',
                ],
                ['message', 'from'],
            ],
            [
                [
                    'reCaptchaAction' => 'action',
                    'reCaptchaToken' => 'token',
                    'message' => 'this is a valid message',
                ],
                ['from'],
            ],
            [
                [
                    'reCaptchaAction' => 'action',
                    'reCaptchaToken' => 'token',
                    'message' => 'this is a valid message',
                    'from' => 'not an email',
                ],
                ['from'],
            ],
        ];
    }
}
