<?php

namespace App\Normalizer;

use App\Exception\FormException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * FormExceptionNormalizer
 * Format a FormException for API Response.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class FormExceptionNormalizer implements NormalizerInterface
{
    /**
     * @param FormException $exception
     * @param null          $format
     *
     * @return array|bool|float|int|string|void
     */
    public function normalize($exception, $format = null, array $context = [])
    {
        $data = [];
        $errors = $exception->getErrors();

        foreach ($errors as $error) {
            $data[$error->getOrigin()->getName()][] = $error->getMessage();
        }

        return [$data];
    }

    /**
     * @param mixed $data
     * @param null  $format
     *
     * @return bool|void
     */
    public function supportsNormalization($data, $format = null)
    {
        return $data instanceof FormException;
    }
}
