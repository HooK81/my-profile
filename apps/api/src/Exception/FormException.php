<?php

namespace App\Exception;

use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * FormException.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class FormException extends HttpException
{
    /**
     * @var FormInterface
     */
    protected $form;

    /**
     * HttpFormException constructor.
     */
    public function __construct(FormInterface $form, int $statusCode = 400, string $message = 'Invalid form', \Exception $previous = null, array $headers = [], ?int $code = 0)
    {
        parent::__construct($statusCode, $message, $previous, $headers, $code);

        $this->form = $form;
    }

    /**
     * @return FormInterface
     */
    public function getForm()
    {
        return $this->form;
    }

    /**
     * @return FormErrorIterator
     */
    public function getErrors()
    {
        return $this->form->getErrors(true);
    }
}
