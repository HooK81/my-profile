<?php

declare(strict_types=1);

namespace App\Tests\EventListener;

use App\EventListener\JWTListener;
use App\Security\TokenManager;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

/**
 * @group time-sensitive
 */
final class JWTListenerTest extends TestCase
{
    /** @var TokenManager|MockObject */
    private TokenManager $tokenManager;
    private JWTListener $listener;

    protected function setUp(): void
    {
        $this->tokenManager = $this->getMockBuilder(TokenManager::class)->disableOriginalConstructor()->getMock();
        $this->listener = new JWTListener($this->tokenManager, 'test');
    }

    public function testOnJwtCreated(): void
    {
        /** @var JWTCreatedEvent|MockObject $event */
        $event = $this->getMockBuilder(JWTCreatedEvent::class)->disableOriginalConstructor()->getMock();
        $event->expects($this->once())
            ->method('setData')
            ->with($this->arrayHasKey('secret'))
        ;

        $this->listener->onJWTCreated($event);
    }

    public function testOnJwtDecodedValid(): void
    {
        /** @var JWTDecodedEvent|MockObject $event */
        $event = $this->getMockBuilder(JWTDecodedEvent::class)->disableOriginalConstructor()->getMock();

        $event->expects($this->once())
            ->method('getPayload')
            ->willReturn(['secret' => 'foo'])
        ;
        $this->tokenManager->expects($this->once())
            ->method('checkTokenSecret')
            ->willReturn(true)
        ;

        $event->expects($this->never())
            ->method('markAsInvalid')
        ;

        $this->listener->onJWTDecoded($event);
    }

    /**
     * @dataProvider jwtDecodedInvalidPayloadProvider
     */
    public function testOnJwtDecodedInvalid(array $payload): void
    {
        /** @var JWTDecodedEvent|MockObject $event */
        $event = $this->getMockBuilder(JWTDecodedEvent::class)->disableOriginalConstructor()->getMock();

        $event->expects($this->once())
            ->method('getPayload')
            ->willReturn($payload)
        ;
        $this->tokenManager->expects($this->atLeast(0))
            ->method('checkTokenSecret')
            ->willReturn(false)
        ;

        $event->expects($this->once())
            ->method('markAsInvalid')
        ;

        $this->listener->onJWTDecoded($event);
    }

    public function jwtDecodedInvalidPayloadProvider(): array
    {
        return [
            [['foo' => 'bar']],
            [['secret' => 'foo']],
        ];
    }

    public function testAuthenticationSuccess(): void
    {
        /** @var AuthenticationSuccessEvent|MockObject $event */
        $event = $this->getMockBuilder(AuthenticationSuccessEvent::class)->disableOriginalConstructor()->getMock();

        $event->expects($this->once())
            ->method('getData')
            ->willReturn(['token' => 'foo'])
        ;

        $response = new Response();
        $response->headers = $this->getMockBuilder(ResponseHeaderBag::class)->getMock();
        $event->expects($this->once())
            ->method('getResponse')
            ->willReturn($response)
        ;

        $tokenTtl = time() + 3600;
        $this->tokenManager->expects($this->once())
            ->method('calculateTokenMaxLifeTime')
            ->willReturn($tokenTtl)
        ;

        $response->headers->expects($this->once())
            ->method('setCookie')
            ->with(
                $this->callback(function (Cookie $cookie) use ($tokenTtl) {
                    $this->assertSame(JWTListener::COOKIE_NAME, $cookie->getName());
                    $this->assertSame(true, $cookie->isHttpOnly());
                    $this->assertSame(JWTListener::COOKIE_STRICT, $cookie->getSameSite());
                    $this->assertSame('foo', $cookie->getValue());
                    $this->assertSame($tokenTtl, $cookie->getExpiresTime());

                    return true;
                })
            )
        ;

        $this->listener->onAuthenticationSuccessResponse($event);
    }
}
