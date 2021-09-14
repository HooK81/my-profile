<?php

declare(strict_types=1);

namespace App\Security;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * ReCaptchaValidator
 * Validate a reCaptcha response.
 */
class ReCaptchaValidator
{
    public const URL = 'siteverify';
    private ?Request $request;
    private LoggerInterface $httpLogger;
    private HttpClientInterface $recaptchaClient;
    private string $secret;

    /**
     * Constructor.
     */
    public function __construct(RequestStack $requestStack, HttpClientInterface $recaptchaClient, LoggerInterface $httpLogger, string $secret)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->recaptchaClient = $recaptchaClient;
        $this->httpLogger = $httpLogger;
        $this->secret = $secret;
    }

    /**
     * Check a recaptcha response.
     *
     * @param string $reCaptchaResponse
     */
    public function checkReCaptchaResponse($reCaptchaResponse): bool
    {
        $body = [
            'response' => $reCaptchaResponse,
            'remoteip' => $this->request->getClientIp(),
        ];
        $this->httpLogger->info('[ReCaptchaValidator][checkReCaptchaResponse] Post', ['url' => self::URL, 'body' => $body]);

        $body['secret'] = $this->secret;
        $response = $this->recaptchaClient->request('POST', self::URL, ['body' => $body]);
        $rawData = $response->getContent(false);
        $this->httpLogger->info('[ReCaptchaValidator][checkReCaptchaResponse] Response', ['url' => self::URL, 'httpStatus' => $response->getStatusCode(), 'response' => $rawData]);

        $data = json_decode($rawData, true);
        if (empty($data) || !\is_array($data) || !isset($data['success'])) {
            $this->httpLogger->debug($response->getInfo('debug'));

            return false;
        }

        return $data['success'];
    }
}
