<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Hobby.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Hobby
{
    /**
     * @JMS\Type("string")
     */
    protected string $title;

    /**
     * @JMS\Type("string")
     */
    protected string $image;

    /**
     * @JMS\Type("string")
     */
    protected string $icon;

    /**
     * Get the value of title.
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Get the value of image.
     */
    public function getImage(): string
    {
        return $this->image;
    }

    /**
     * Get the value of icon.
     */
    public function getIcon(): string
    {
        return $this->icon;
    }
}
