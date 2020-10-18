<?php

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
     *
     * @var string
     */
    protected $degree;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $school;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $city;
    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $date;

    /**
     * Get the value of degree.
     *
     * @return string
     */
    public function getDegree()
    {
        return $this->degree;
    }

    /**
     * Get the value of school.
     *
     * @return string
     */
    public function getSchool()
    {
        return $this->school;
    }

    /**
     * Get the value of city.
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Get the value of date.
     *
     * @return string
     */
    public function getDate()
    {
        return $this->date;
    }
}
