<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Exception\FormException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * FormExceptionNormalizer
 * Format a FormException for API Response.
 *

 * @SuppressWarnings(PHPMD.UnusedFormalParameter)
 */
class FormExceptionNormalizer implements NormalizerInterface
{
    /**
     * @param FormException $exception
     * @param null          $format
     */
    public function normalize($exception, string $format = null, array $context = []): array
    {
        $data = [];
        $errors = $exception->getErrors();

        foreach ($errors as $error) {
            $data[$error->getOrigin()->getName()][] = $error->getMessage();
        }

        return [$data];
    }

    public function supportsNormalization($data, string $format = null): bool
    {
        return $data instanceof FormException;
    }
}
