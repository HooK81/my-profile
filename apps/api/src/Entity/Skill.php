<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Skill.
 *
 * @see Profile
 */
class Skill
{
    /**
     * @JMS\Type("string")
     */
    protected string $name;

    /**
     * @JMS\Type("string")
     */
    protected string $level;

    /**
     * Get the value of name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Get the value of level.
     */
    public function getLevel(): string
    {
        return $this->level;
    }
}
