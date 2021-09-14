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
     * @var NormalizerInterface[]
     */
    private iterable $normalizers;

    /**
     * NormalizerFactory constructor.
     */
    public function __construct(iterable $normalizers)
    {
        $this->normalizers = $normalizers;
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
