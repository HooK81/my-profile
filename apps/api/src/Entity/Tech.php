<?php

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
     *
     * @var string
     */
    protected $name;

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
    protected $desc;

    /**
     * Get the value of name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
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
     * Get the value of desc.
     *
     * @return string
     */
    public function getDesc()
    {
        return $this->desc;
    }
}
