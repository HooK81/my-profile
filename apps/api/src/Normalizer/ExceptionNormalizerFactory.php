<?php

namespace App\Normalizer;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * ExceptionNormalizerFactory
 * Get normalizer for an exception.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class ExceptionNormalizerFactory
{
    /**
     * @var NormalizerInterface[]
     */
    private $normalizers;

    /**
     * NormalizerFactory constructor.
     */
    public function __construct(iterable $normalizers)
    {
        $this->normalizers = $normalizers;
    }

    /**
     * Returns the normalizer by supported data.
     *
     * @param mixed $data
     *
     * @return NormalizerInterface|null
     */
    public function getNormalizer($data)
    {
        foreach ($this->normalizers as $normalizer) {
            if ($normalizer instanceof NormalizerInterface && $normalizer->supportsNormalization($data)) {
                return $normalizer;
            }
        }

        return null;
    }
}
