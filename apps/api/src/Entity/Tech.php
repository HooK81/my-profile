<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Tech.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Tech
{
    /**
     * @JMS\Type("string")
     */
    protected string $name;

    /**
     * @JMS\Type("string")
     */
    protected string  $image;

    /**
     * @JMS\Type("string")
     */
    protected string $desc;

    /**
     * Get the value of name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Get the value of image.
     */
    public function getImage(): string
    {
        return $this->image;
    }

    /**
     * Get the value of desc.
     */
    public function getDesc(): string
    {
        return $this->desc;
    }
}
