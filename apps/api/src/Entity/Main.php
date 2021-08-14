<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Main.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Main
{
    /**
     * @JMS\Type("string")
     */
    protected string $lastName;

    /**
     * @JMS\Type("string")
     */
    protected string $firstName;

    /**
     * @JMS\Type("string")
     */
    protected string $fullName;

    /**
     * @JMS\Type("string")
     */
    protected string $occupation;

    /**
     * @JMS\Type("string")
     */
    protected string $description;

    /**
     * @JMS\Type("string")
     */
    protected string $image;

    /**
     * @JMS\Type("string")
     */
    protected string $bio;

    /**
     * @JMS\Type("string")
     */
    protected string $email;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $base;

    /**
     * @JMS\Type("App\Entity\Address")
     */
    protected Address $address;

    /**
     * @JMS\Type("string")
     */
    protected string $phone;

    /**
     * @JMS\Type("string")
     */
    protected string $website;

    /**
     * @JMS\Type("string")
     */
    protected string $resumePdf;

    /**
     * @JMS\Type("array<App\Entity\Social>")
     *
     * @var Social[]
     */
    protected array $social;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->address = new Address();
        $this->social = [];
    }

    /**
     * Get the value of lastName.
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }

    /**
     * Get the value of firstName.
     */
    public function getFirstName(): string
    {
        return $this->firstName;
    }

    /**
     * Get the value of fullName.
     */
    public function getFullName(): string
    {
        return $this->fullName;
    }

    /**
     * Get the value of occupation.
     */
    public function getOccupation(): string
    {
        return $this->occupation;
    }

    /**
     * Get the value of description.
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * Get the value of image.
     */
    public function getImage(): string
    {
        return $this->image;
    }

    /**
     * Get the value of bio.
     */
    public function getBio(): string
    {
        return $this->bio;
    }

    /**
     * Get the value of email.
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Get the value of base.
     */
    public function getBase(): string
    {
        return $this->base;
    }

    /**
     * Get the value of address.
     */
    public function getAddress(): Address
    {
        return $this->address;
    }

    /**
     * Get the value of phone.
     */
    public function getPhone(): string
    {
        return $this->phone;
    }

    /**
     * Get the value of website.
     */
    public function getWebsite(): string
    {
        return $this->website;
    }

    /**
     * Get the value of resumePdf.
     */
    public function getResumePdf(): string
    {
        return $this->resumePdf;
    }
}
