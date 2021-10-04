<?php

declare(strict_types=1);

namespace App\ReCaptcha;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

/**
 * ReCaptchaValidator
 * Validate a reCaptcha response.
 */
class ReCaptchaValidator
{
    private const URL = 'siteverify';
    private ?Request $request;
    private LoggerInterface $mainLogger;
    private LoggerInterface $httpLogger;
    private HttpClientInterface $recaptchaClient;
    private ReCaptchaResponseFactory $reCaptchaResponseFactory;
    private string $secret;
    private float $minValidateScore;

    /**
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(RequestStack $requestStack, HttpClientInterface $recaptchaClient, ReCaptchaResponseFactory $reCaptchaResponseFactory, LoggerInterface $mainLogger, LoggerInterface $httpLogger, string $secret, float $minValidateScore)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->recaptchaClient = $recaptchaClient;
        $this->reCaptchaResponseFactory = $reCaptchaResponseFactory;
        $this->mainLogger = $mainLogger;
        $this->httpLogger = $httpLogger;
        $this->secret = $secret;
        $this->minValidateScore = $minValidateScore;
    }

    /**
     * Check a recaptcha response.
     */
    public function checkReCaptchaResponse(string $action, string $token): ReCaptchaResponse
    {
        $responseData = $this->sendRequest($token);

        return $this->isReCaptchaTokenValid($action, $responseData);
    }

    private function sendRequest(string $token): array
    {
        $body = [
            'response' => $token,
            'remoteip' => $this->request->getClientIp(),
            'secret' => $this->secret,
        ];
        $this->logRequest($body);
        $response = $this->recaptchaClient->request('POST', self::URL, ['body' => $body]);
        $this->logResponse($response);

        return json_decode($response->getContent(false), true);
    }

    private function isReCaptchaTokenValid(string $action, array $responseData): ReCaptchaResponse
    {
        if (empty($responseData) || !\is_array($responseData) || !isset($responseData['success']) || !isset($responseData['score'])) {
            $this->mainLogger->debug('[ReCaptchaValidator][checkReCaptchaResponse] Invalid response', ['requestedAction' => $action]);

            return $this->reCaptchaResponseFactory->factory(false, ReCaptchaResponse::MSG_INVALID_RESPONSE);
        }
        if ($responseData['action'] !== $action) {
            $this->mainLogger->warning('[ReCaptchaValidator][checkReCaptchaResponse] Invalid Action', ['requestedAction' => $action, 'receivedAction' => $responseData['action']]);

            return $this->reCaptchaResponseFactory->factory(false, ReCaptchaResponse::MSG_INVALID_ACTION);
        }
        if (!$responseData['success']) {
            $this->mainLogger->warning('[ReCaptchaValidator][checkReCaptchaResponse] Invalid reCaptcha token', ['requestedAction' => $action]);

            return $this->reCaptchaResponseFactory->factory(false, ReCaptchaResponse::MSG_INVALID_TOKEN);
        }
        if ($responseData['score'] <= $this->minValidateScore) {
            $this->mainLogger->warning('[ReCaptchaValidator][checkReCaptchaResponse] Score too low', ['requestedAction' => $action, 'score' => $responseData['score']]);

            return $this->reCaptchaResponseFactory->factory(false, ReCaptchaResponse::MSG_SCORE_TOO_LOW);
        }

        $this->mainLogger->info('[ReCaptchaValidator][checkReCaptchaResponse] Token Validated', ['requestedAction' => $action, 'score' => $responseData['score']]);
        return $this->reCaptchaResponseFactory->factory(true);
    }

    private function logRequest(array $requestBody)
    {
        unset($requestBody['secret']);
        $this->httpLogger->info('[ReCaptchaValidator][checkReCaptchaResponse] Post', ['url' => self::URL, 'body' => $requestBody]);
    }

    private function logResponse(ResponseInterface $response)
    {
        $this->httpLogger->info('[ReCaptchaValidator][checkReCaptchaResponse] Response', ['url' => self::URL, 'httpStatus' => $response->getStatusCode(), 'response' => $response->getContent(false)]);
    }
}
