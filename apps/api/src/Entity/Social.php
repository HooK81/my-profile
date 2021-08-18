<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Social.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Social
{
    /**
     * @JMS\Type("string")
     */
    protected string $name;

    /**
     * @JMS\Type("string")
     */
    protected string $url;

    /**
     * @JMS\Type("string")
     */
    protected string $icon;

    /**
     * Get the value of name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Get the value of url.
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * Get the value of icon.
     */
    public function getIcon(): string
    {
        return $this->icon;
    }
}
