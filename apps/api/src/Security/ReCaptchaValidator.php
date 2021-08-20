<?php

declare(strict_types=1);

namespace App\Security;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * ReCaptchaValidator
 * Validate a reCaptcha response.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class ReCaptchaValidator
{
    public const URL = 'https://www.google.com/recaptcha/api/siteverify';
    private Request $request;
    private LoggerInterface $logger;
    private string $secret;

    /**
     * Constructor.
     */
    public function __construct(RequestStack $requestStack, LoggerInterface $httpLogger, string $secret)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->logger = $httpLogger;
        $this->secret = $secret;
    }

    /**
     * Check a recaptcha response.
     *
     * @param string $reCaptchaResponse
     *
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function checkReCaptchaResponse($reCaptchaResponse): bool
    {
        $httpClient = HttpClient::create();
        $body = [
            'secret' => $this->secret,
            'response' => $reCaptchaResponse,
            'remoteip' => $this->request->getClientIp(),
        ];
        $this->logger->info('[ReCaptchaValidator][checkReCaptchaResponse] Post request', ['method' => 'POST', 'url' => self::URL, 'body' => $body]);
        $response = $httpClient->request('POST', self::URL, ['body' => $body]);

        $rawData = $response->getContent(false);
        $this->logger->info('[ReCaptchaValidator][checkReCaptchaResponse] Response', ['method' => 'POST', 'url' => self::URL, 'httpStatus' => $response->getStatusCode(), 'headers' => $response->getHeaders(), 'response' => $rawData]);

        $data = json_decode($rawData, true);
        if (empty($data) || !\is_array($data) || !isset($data['success'])) {
            return false;
        }

        return $data['success'];
    }
}
