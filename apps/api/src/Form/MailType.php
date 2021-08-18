<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Mail Form
 *
 * @author Julien CROCHET <julien@crochet.me>
 * @SuppressWarnings(PHPMD.UnusedFormalParameter)
 */
class MailType extends AbstractType
{
    public const SUBJECT_MIN_LENGTH = 10;

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('message', TextType::class, [
                'required' => true,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Length(['min' => self::SUBJECT_MIN_LENGTH]),
                ],
            ])
            ->add('from', EmailType::class, [
                'required' => true,
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Email([
                        'mode' => Assert\Email::VALIDATION_MODE_HTML5,
                    ]),
                ],
            ])
            ->add('subject', TextType::class, [
                'required' => false,
            ])
            ->add('reCaptchaResponse', HiddenType::class, [
                'required' => true,
                'constraints' => [
                    new Assert\NotBlank(),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
        ]);
    }
}
