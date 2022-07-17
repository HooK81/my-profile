<?php

declare(strict_types=1);

namespace App\Exception;

use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * FormException.
 */
class FormException extends HttpException
{
    /**
     * HttpFormException constructor.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(protected FormInterface $form, int $statusCode = 400, string $message = 'Invalid form', \Exception $previous = null, array $headers = [], ?int $code = 0)
    {
        parent::__construct($statusCode, $message, $previous, $headers, $code);
    }

    public function getErrors(): FormErrorIterator
    {
        return $this->form->getErrors(true);
    }
}
