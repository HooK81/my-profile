<?php

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
     *
     * @var string
     */
    protected $name;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $url;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $icon;

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
     * Get the value of url.
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
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
