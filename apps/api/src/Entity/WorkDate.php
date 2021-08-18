<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * WorkDate.
 *
 * @see Work
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class WorkDate
{
    /**
     * @JMS\Type("string")
     */
    protected string $start;

    /**
     * @JMS\Type("string")
     */
    protected ?string $end;

    /**
     * Get the value of start.
     */
    public function getStart(): string
    {
        return $this->start;
    }

    /**
     * Get the value of end.
     */
    public function getEnd(): ?string
    {
        return $this->end;
    }
}
