<?php

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Work.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Work
{
    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $title;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $company;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $city;

    /**
     * @JMS\Type("App\Entity\WorkDate")
     *
     * @var WorkDate
     */
    protected $date;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $description;

    public function __construct()
    {
        $this->date = new WorkDate();
    }

    /**
     * Get the value of title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Get the value of company.
     *
     * @return string
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * Get the value of city.
     *
     * @return string
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

    /**
     * Get the value of description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }
}
