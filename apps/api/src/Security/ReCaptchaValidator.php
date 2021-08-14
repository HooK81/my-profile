<?php

declare(strict_types=1);

namespace App\Security;

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
    private string $secret;

    /**
     * Constructor.
     */
    public function __construct(RequestStack $requestStack, string $secret)
    {
        $this->request = $requestStack->getCurrentRequest();
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
        $response = $httpClient->request('POST', self::URL, ['body' => [
            'secret' => $this->secret,
            'response' => $reCaptchaResponse,
            'remoteip' => $this->request->getClientIp(),
        ]]);

        $rawData = $response->getContent(false);
        $data = json_decode($rawData, true);
        if (empty($data) || !\is_array($data) || !isset($data['success'])) {
            return false;
        }

        return $data['success'];
    }
}
