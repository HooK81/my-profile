<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Tests\Constants\Constants;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class AuthControllerTest extends WebTestCase
{
    public const ERROR_INVALID_CREDENTIALS = 'Invalid credentials.';
    public const ERROR_INVALID_JSON = 'Invalid JSON.';
    public const ERROR_NO_JWT_TOKEN = 'JWT Token not found';

    public function testSuccessAuthentication(): string
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/auth/login',
            [], [],
            [
                'HTTP_KEY' => Constants::AUTH_KEY,
            ],
            json_encode([
                'username' => Constants::AUTH_USERNAME,
                'password' => Constants::AUTH_PASSWORD,
            ])
        );
        $this->assertResponseIsSuccessful();
        $tokenCookieArray = array_filter(
            $client->getResponse()->headers->getCookies(),
            function ($cookie) {
                return 'Bearer' === $cookie->getName();
            }
        );
        $this->assertNotEmpty($tokenCookieArray);
        $tokenCookie = $tokenCookieArray[0];

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $response);
        $this->assertEquals($tokenCookie->getValue(), $response['token'], 'should token be the same in response and cookie');

        return $response['token'];
    }

    public function testInvalidBodyAuthentication(): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/auth/login',
            [], [],
            [
                'HTTP_KEY' => Constants::AUTH_KEY,
            ],
            null
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response['code']);
        $this->assertEquals(self::ERROR_INVALID_JSON, $response['message']);
    }

    /**
     * @dataProvider keyProvider
     */
    public function testKeyErrorAuthentication(?string $key): void
    {
        $headers = (null !== $key) ? [
            'HTTP_KEY' => $key,
        ] : [];

        $client = static::createClient();
        $client->request(
            'POST',
            '/auth/login',
            [], [],
            $headers,
            json_encode([
                'username' => Constants::AUTH_USERNAME,
                'password' => Constants::AUTH_PASSWORD,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $response['code']);
        $this->assertEquals(self::ERROR_INVALID_CREDENTIALS, $response['message']);
    }

    public function keyProvider(): array
    {
        return [
            [null],
            [''],
            ['foo'],
        ];
    }

    /**
     * @dataProvider userPwdProvider
     */
    public function testUserErrorAuthentication(?string $username, ?string $password): void
    {
        $client = static::createClient();
        $client->request(
            'POST',
            '/auth/login',
            [], [],
            [
                'HTTP_KEY' => Constants::AUTH_KEY,
            ],
            json_encode([
                'username' => $username,
                'password' => $password,
            ])
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $response['code']);
        $this->assertEquals(self::ERROR_INVALID_CREDENTIALS, $response['message']);
    }

    public function userPwdProvider(): array
    {
        return [
            ['user', ''],
            ['', 'pwd'],
            ['', ''],
        ];
    }

    /**
     * @depends testSuccessAuthentication
     */
    public function testAuthenticationOk($token): void
    {
        $client = static::createClient();
        $client->request(
            'GET',
            '/en/v1/users/' . Constants::USER_ID,
            [], [],
            [
                'HTTP_KEY' => Constants::AUTH_KEY,
                'HTTP_Authorization' => 'Bearer ' . $token,
            ]
        );
        $this->assertResponseIsSuccessful();
    }

    public function testAuthenticationInvalidToken(): void
    {
        $client = static::createClient();
        $client->request(
            'GET',
            '/en/v1/users/' . Constants::USER_ID,
            [], [],
            [
                'HTTP_Authorization' => 'Bearer Not a JWT Token',
            ]
        );
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $response['code']);
        $this->assertEquals(self::ERROR_NO_JWT_TOKEN, $response['message']);
    }
}
