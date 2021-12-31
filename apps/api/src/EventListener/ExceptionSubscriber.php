<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Normalizer\ExceptionNormalizerFactory;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Exception Subscriber / Listener : Ensure to always return a JSON response
 * when an exception is thrown.
 */
class ExceptionSubscriber implements EventSubscriberInterface
{
    private ExceptionNormalizerFactory $normalizerFactory;

    public function __construct(ExceptionNormalizerFactory $normalizerFactory)
    {
        $this->normalizerFactory = $normalizerFactory;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['processException', -10],
        ];
    }

    /**
     * Replace exception response by a JSON stream.
     */
    public function processException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        $response = $this->createApiResponse($exception);
        $event->setResponse($response);
    }

    /**
     * Creates the JsonResponse from any Exception.
     */
    private function createApiResponse(\Throwable $exception): JsonResponse
    {
        $normalizer = $this->normalizerFactory->getNormalizer($exception);
        $code = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : Response::HTTP_INTERNAL_SERVER_ERROR;

        try {
            $errors = $normalizer ? $normalizer->normalize($exception) : [];
        } catch (\Exception $e) {
            $errors = [];
        }

        $response = [
            'code' => $code,
            'message' => $exception->getMessage(),
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return new JsonResponse($response);
    }
}
