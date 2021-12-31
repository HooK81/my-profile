<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Tests\Constants\Constants;
use App\Tests\Traits\LoggedUserTrait;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class ProfileControllerTest extends WebTestCase
{
    use LoggedUserTrait;

    public const ERROR_PROFILE_NOT_FOUND = 'profile [%s] not found';
    public const ERROR_PROFILE_ROUTE = 'No route found for "GET http://localhost%s"';
    public const CONTENT_TYPE_JPG = 'image/jpeg';
    public const CONTENT_DISPOSITION_PROFILE = 'attachment; filename=profile.jpg';
    public const CONTENT_TYPE_VCARD = 'text/x-vcard; charset=UTF-8';
    public const CONTENT_DISPOSITION_VCARD = 'attachment; filename="John_Doe.vcf"';

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->setLoggedUser($this->client);
    }

    public function testGetProfileEnSuccess(): void
    {
        $this->client->request('GET', '/en/v1/users/' . Constants::USER_ID);

        $this->assertResponseIsSuccessful();
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $response);
        $this->assertArrayHasKey('main', $response);
        $this->assertArrayHasKey('resume', $response);
        $this->assertArrayHasKey('hobbies', $response);
    }

    public function testGetProfileFrSuccess(): void
    {
        $this->client->request('GET', '/fr/v1/users/' . Constants::USER_ID);

        $this->assertResponseIsSuccessful();
    }

    public function testGetProfileLocaleError(): void
    {
        $route = '/xx/v1/users/' . Constants::USER_ID;
        $this->client->request('GET', $route);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_NOT_FOUND, $response['code']);
        $this->assertEquals(sprintf(self::ERROR_PROFILE_ROUTE, $route), $response['message']);
    }

    public function testGetProfileIdError(): void
    {
        $userId = 'foo';
        $this->client->request('GET', '/en/v1/users/' . $userId);

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
        $response = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(Response::HTTP_NOT_FOUND, $response['code']);
        $this->assertEquals(sprintf(self::ERROR_PROFILE_NOT_FOUND, $userId), $response['message']);
    }

    public function testGetProfileFileSuccess(): void
    {
        $this->client->request('GET', '/en/v1/users/' . Constants::USER_ID . '/files/' . Constants::PROFILE_JPG);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(self::CONTENT_TYPE_JPG, $this->client->getResponse()->headers->get('content-type'));
    }

    public function testGetProfileFileDownloadSuccess(): void
    {
        $this->client->request(
            'GET',
            '/en/v1/users/' . Constants::USER_ID . '/files/' . Constants::PROFILE_JPG,
            ['disposition' => 'attachment']
        );

        $this->assertResponseIsSuccessful();
        $this->assertEquals(self::CONTENT_TYPE_JPG, $this->client->getResponse()->headers->get('content-type'));
        $this->assertEquals(self::CONTENT_DISPOSITION_PROFILE, $this->client->getResponse()->headers->get('content-disposition'));
    }

    public function testGetProfileFileNotFoundError(): void
    {
        $this->client->request('GET', '/en/v1/users/' . Constants::USER_ID . '/files/foo.bar');
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testGetProfileVCardSuccess(): void
    {
        $this->client->request('GET', '/en/v1/users/' . Constants::USER_ID . '/vcard');

        $this->assertResponseIsSuccessful();
        $this->assertEquals(self::CONTENT_TYPE_VCARD, $this->client->getResponse()->headers->get('content-type'));
        $this->assertEquals(self::CONTENT_DISPOSITION_VCARD, $this->client->getResponse()->headers->get('content-disposition'));
    }
}
