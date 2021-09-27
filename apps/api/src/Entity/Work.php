<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * Work.
 *
 * @see Profile
 */
class Work
{
    protected string $title;
    protected string $company;
    protected string $city;
    protected WorkDate $date;
    protected string $description;

    public function __construct()
    {
        $this->date = new WorkDate();
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getCompany(): string
    {
        return $this->company;
    }

    public function setCompany(string $company): self
    {
        $this->company = $company;

        return $this;
    }

    public function getCity(): string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getDate(): WorkDate
    {
        return $this->date;
    }

    public function setDate(WorkDate $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }
}
