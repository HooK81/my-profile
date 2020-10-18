<?php

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Skill.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Skill
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
    protected $level;

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
     * Get the value of level.
     *
     * @return string
     */
    public function getLevel()
    {
        return $this->level;
    }
}
