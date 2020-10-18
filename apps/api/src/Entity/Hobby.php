<?php

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
     *
     * @var string
     */
    protected $title;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $image;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $icon;

    /**
     * Get the value of title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Get the value of image.
     *
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Get the value of icon.
     *
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }
}
