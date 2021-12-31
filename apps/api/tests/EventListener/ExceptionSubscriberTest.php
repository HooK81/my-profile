<?php

declare(strict_types=1);

namespace App\Tests\EventListener;

use App\EventListener\ExceptionSubscriber;
use App\Normalizer\ExceptionNormalizerFactory;
use Exception;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class ExceptionSubscriberTest extends TestCase
{
    private ExceptionSubscriber $subscriber;
    /** @var ExceptionNormalizerFactory|MockObject */
    private $normalizerFactory;

    protected function setUp(): void
    {
        /** @var ExceptionNormalizerFactory|MockObject */
        $this->normalizerFactory = $this->getMockBuilder(ExceptionNormalizerFactory::class)->disableOriginalConstructor()->getMock();
        $this->subscriber = new ExceptionSubscriber($this->normalizerFactory, 'test');
    }

    /**
     * @SuppressWarnings(PHPMD.StaticAccess)
     */
    public function testGetSubscribedEvents(): void
    {
        $events = ExceptionSubscriber::getSubscribedEvents();
        $this->assertIsArray($events);
        $this->assertArrayHasKey(KernelEvents::EXCEPTION, $events);
    }

    public function testWithoutNormalizer(): void
    {
        /** @var ExceptionEvent|MockObject */
        $event = $this->getMockBuilder(ExceptionEvent::class)->disableOriginalConstructor()->getMock();
        $event->expects($this->once())
            ->method('getThrowable')
            ->willReturn(new NotFoundHttpException('error'))
        ;

        $event->expects($this->once())
            ->method('setResponse')
            ->with(
                $this->callback(function (Response $response) {
                    $content = json_decode($response->getContent(), true);
                    $this->assertSame(Response::HTTP_NOT_FOUND, $content['code']);
                    $this->assertSame('error', $content['message']);
                    $this->assertArrayNotHasKey('errors', $content);

                    return true;
                })
            )
        ;
        $this->subscriber->processException($event);
    }

    public function testWithNormalizer(): void
    {
        /** @var ExceptionEvent|MockObject */
        $event = $this->getMockBuilder(ExceptionEvent::class)->disableOriginalConstructor()->getMock();
        $event->expects($this->once())
            ->method('getThrowable')
            ->willReturn(new NotFoundHttpException('error'))
        ;

        $normalizer = $this->getMockBuilder(NormalizerInterface::class)->getMock();
        $normalizer->expects($this->once())
            ->method('normalize')
            ->willReturn('normalized error')
        ;

        $this->normalizerFactory->expects($this->once())
            ->method('getNormalizer')
            ->willReturn($normalizer)
        ;

        $event->expects($this->once())
            ->method('setResponse')
            ->with(
                $this->callback(function (Response $response) {
                    $content = json_decode($response->getContent(), true);
                    $this->assertSame(Response::HTTP_NOT_FOUND, $content['code']);
                    $this->assertSame('error', $content['message']);
                    $this->assertSame('normalized error', $content['errors']);

                    return true;
                })
            )
        ;
        $this->subscriber->processException($event);
    }

    public function testWithNormalizerException(): void
    {
        /** @var ExceptionEvent|MockObject */
        $event = $this->getMockBuilder(ExceptionEvent::class)->disableOriginalConstructor()->getMock();
        $event->expects($this->once())
            ->method('getThrowable')
            ->willReturn(new Exception('error'))
        ;

        $normalizer = $this->getMockBuilder(NormalizerInterface::class)->getMock();
        $normalizer->expects($this->once())
            ->method('normalize')
            ->will($this->throwException(new Exception('normalizer exception')))
        ;

        $this->normalizerFactory->expects($this->once())
            ->method('getNormalizer')
            ->willReturn($normalizer)
        ;

        $event->expects($this->once())
            ->method('setResponse')
            ->with(
                $this->callback(function (Response $response) {
                    $content = json_decode($response->getContent(), true);
                    $this->assertSame(Response::HTTP_INTERNAL_SERVER_ERROR, $content['code']);
                    $this->assertSame('error', $content['message']);
                    $this->assertArrayNotHasKey('errors', $content);

                    return true;
                })
            )
        ;
        $this->subscriber->processException($event);
    }
}
