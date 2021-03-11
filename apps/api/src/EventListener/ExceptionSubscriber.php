<?php

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
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class ExceptionSubscriber implements EventSubscriberInterface
{
    /**
     * @var ExceptionNormalizerFactory
     */
    private $normalizerFactory;

    public function __construct(ExceptionNormalizerFactory $normalizerFactory)
    {
        $this->normalizerFactory = $normalizerFactory;
    }

    /**
     * Return the subscribed events, their methods and priorities.
     *
     * @codeCoverageIgnore
     *
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::EXCEPTION => 'processException',
        ];
    }

    /**
     * Replace exception response by a JSON stream.
     *
     * @return void
     */
    public function processException(ExceptionEvent $event)
    {
        $response = new Response();
        $exception = $event->getThrowable();

        $response = $this->createApiResponse($exception);
        $event->setResponse($response);
    }

    /**
     * Creates the JsonResponse from any Exception.
     *
     * @return JsonResponse
     */
    private function createApiResponse(\Throwable $exception)
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
