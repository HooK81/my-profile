<?php

namespace App\Normalizer;

use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigatorInterface;
use JMS\Serializer\Handler\SubscribingHandlerInterface;
use JMS\Serializer\JsonSerializationVisitor;
use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\ErrorHandler\Exception\FlattenException;

/**
 * API Exception Normalizer
 * Normalize all exceptions to a standard output.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class APIExceptionNormalizer implements SubscribingHandlerInterface
{
    /**
     * @var Serializer
     */
    private $serializer;

    /**
     * APIExceptionHandler constructor.
     */
    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @return array
     */
    public static function getSubscribingMethods()
    {
        return [
            [
                'direction' => GraphNavigatorInterface::DIRECTION_SERIALIZATION,
                'format' => 'json',
                'type' => FlattenException::class,
                'method' => 'serializeToJson',
            ],
        ];
    }

    /**
     * Build standard response.
     *
     * @return array
     */
    public function serializeToJson(
        JsonSerializationVisitor $visitor,
        FlattenException $exception,
        array $type,
        Context $context
    ) {
        return [
            'code' => $exception->getStatusCode(),
            'message' => $exception->getMessage(),
        ];
    }
}
