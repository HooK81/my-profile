<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Education.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Education
{
    /**
     * @JMS\Type("string")
     */
    protected string $degree;

    /**
     * @JMS\Type("string")
     */
    protected string $school;

    /**
     * @JMS\Type("string")
     */
    protected string $city;
    /**
     * @JMS\Type("string")
     */
    protected string $date;

    /**
     * Get the value of degree.
     */
    public function getDegree(): string
    {
        return $this->degree;
    }

    /**
     * Get the value of school.
     */
    public function getSchool(): string
    {
        return $this->school;
    }

    /**
     * Get the value of city.
     */
    public function getCity(): string
    {
        return $this->city;
    }

    /**
     * Get the value of date.
     */
    public function getDate(): string
    {
        return $this->date;
    }
}
