<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * WorkDate.
 *
 * @see Work
 */
class WorkDate
{
    protected string $start;
    protected ?string $end;

    public function getStart(): string
    {
        return $this->start;
    }

    public function setStart(string $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getEnd(): ?string
    {
        return $this->end;
    }

    public function setEnd(?string $end): self
    {
        $this->end = $end;

        return $this;
    }
}
