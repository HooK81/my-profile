<?php

declare(strict_types=1);

namespace App\Normalizer;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * ExceptionNormalizerFactory
 * Get normalizer for an exception.
 */
class ExceptionNormalizerFactory
{
    /**
     * @param NormalizerInterface[] $normalizers
     */
    public function __construct(private iterable $normalizers)
    {
    }

    /**
     * Returns the normalizer by supported data
     */
    public function getNormalizer(object $data): ?NormalizerInterface
    {
        foreach ($this->normalizers as $normalizer) {
            if ($normalizer instanceof NormalizerInterface && $normalizer->supportsNormalization($data)) {
                return $normalizer;
            }
        }

        return null;
    }
}
