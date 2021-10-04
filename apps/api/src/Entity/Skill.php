<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * Skill.
 *
 * @see Profile
 */
class Skill
{
    protected string $name;
    protected int $level;

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLevel(): int
    {
        return $this->level;
    }

    public function setLEvel(int $level): self
    {
        $this->level = $level;

        return $this;
    }
}
