<?php

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
     *
     * @var string
     */
    protected $start;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $end;

    /**
     * Get the value of start.
     *
     * @return string
     */
    public function getStart()
    {
        return $this->start;
    }

    /**
     * Get the value of end.
     *
     * @return string
     */
    public function getEnd()
    {
        return $this->end;
    }
}
