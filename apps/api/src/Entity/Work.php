<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Work.
 *
 * @see Profile
 */
class Work
{
    /**
     * @JMS\Type("string")
     */
    protected string $title;

    /**
     * @JMS\Type("string")
     */
    protected string $company;

    /**
     * @JMS\Type("string")
     */
    protected string $city;

    /**
     * @JMS\Type("App\Entity\WorkDate")
     */
    protected WorkDate $date;

    /**
     * @JMS\Type("string")
     */
    protected string $description;

    public function __construct()
    {
        $this->date = new WorkDate();
    }

    /**
     * Get the value of title.
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Get the value of company.
     */
    public function getCompany(): string
    {
        return $this->company;
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
    public function getDate(): WorkDate
    {
        return $this->date;
    }

    /**
     * Get the value of description.
     */
    public function getDescription(): string
    {
        return $this->description;
    }
}
