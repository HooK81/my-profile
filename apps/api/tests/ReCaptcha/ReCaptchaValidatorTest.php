<?php

declare(strict_types=1);

namespace App\Tests\ReCaptcha;

use App\ReCaptcha\ReCaptchaClient;
use App\ReCaptcha\ReCaptchaResponse;
use App\ReCaptcha\ReCaptchaResponseFactory;
use PHPUnit\Framework\Constraint\Constraint;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

final class ReCaptchaClientTest extends TestCase
{
    private Request $currentRequest;
    /** @var RequestStack|MockObject */
    private RequestStack $requestStack;
    private LoggerInterface $mainLogger;
    private LoggerInterface $httpLogger;
    /** @var ReCaptchaResponseFactory|MockObject */
    private ReCaptchaResponseFactory $reCaptchaResponseFactory;
    public const SECRET = 'secret';
    public const SCORE_OK = 1;
    public const SCORE_KO = 0.5;

    protected function setUp(): void
    {
        ($this->currentRequest = new Request())->initialize();
        $this->requestStack = $this->getMockBuilder(RequestStack::class)->getMock();
        $this->requestStack->method('getCurrentRequest')->willReturn($this->currentRequest);
        $this->mainLogger = $this->getMockBuilder(LoggerInterface::class)->getMock();
        $this->httpLogger = $this->getMockBuilder(LoggerInterface::class)->getMock();
        $this->reCaptchaResponseFactory = $this->getMockBuilder(ReCaptchaResponseFactory::class)->disableOriginalConstructor()->getMock();
    }

    private function buildValidator(MockHttpClient $mockHttpClient): ReCaptchaClient
    {
        return new ReCaptchaClient(
            $this->requestStack,
            $mockHttpClient,
            $this->reCaptchaResponseFactory,
            $this->mainLogger,
            $this->httpLogger,
            self::SECRET,
            self::SCORE_KO
        );
    }

    /**
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     * @dataProvider reCaptchaProvider
     */
    public function testRecapcha(float $score, string $actionCalled, string $actionResponse, ?bool $sucess, bool $isValid, Constraint $error): void
    {
        $client = new MockHttpClient([
            new MockResponse(json_encode([
                'success' => $sucess,
                'score' => $score,
                'action' => $actionResponse,
            ]), [
                'http_code' => 500,
                'response_headers' => ['Content-Type: application/json'],
            ]),
        ]);
        $validator = $this->buildValidator($client);

        $this->reCaptchaResponseFactory->expects($this->once())
            ->method('factory')
            ->with($isValid, $error)
        ;

        $validator->checkReCaptchaResponse($actionCalled, 'token');
    }

    public function reCaptchaProvider(): array
    {
        return [
            [self::SCORE_OK, 'action', 'action', true, true, $this->anything()],
            [self::SCORE_KO, 'action', 'action', true, false, $this->stringStartsWith(ReCaptchaResponse::MSG_SCORE_TOO_LOW)],
            [self::SCORE_OK, 'action', 'action', false, false, $this->stringStartsWith(ReCaptchaResponse::MSG_INVALID_TOKEN)],
            [self::SCORE_OK, 'action_called', 'action_response', false, false, $this->stringStartsWith(ReCaptchaResponse::MSG_INVALID_ACTION)],
            [self::SCORE_OK, 'action', 'action', null, false, $this->stringStartsWith(ReCaptchaResponse::MSG_INVALID_RESPONSE)],
        ];
    }

    public function testRecapchaWithHttpError(): void
    {
        $client = new MockHttpClient([
            new MockResponse('error', [
                'http_code' => 500,
            ]),
        ]);
        $validator = $this->buildValidator($client);

        $this->reCaptchaResponseFactory->expects($this->once())
            ->method('factory')
            ->with(false, $this->stringStartsWith(ReCaptchaResponse::MSG_INVALID_RESPONSE))
        ;

        $validator->checkReCaptchaResponse('foo', 'token');
    }
}
