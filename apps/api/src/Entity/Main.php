<?php

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
     *
     * @var string
     */
    protected $name;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $fullName;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $occupation;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $description;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $image;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $bio;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $email;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $base;

    /**
     * @JMS\Type("App\Entity\Address")
     *
     * @var Address
     */
    protected $address;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $phone;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $resumePdf;

    /**
     * @JMS\Type("array<App\Entity\Social>")
     *
     * @var Social[]
     */
    protected $social;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->address = new Address();
        $this->social = [];
        $this->descriptionHighlightedWords = [];
    }

    /**
     * Get the value of name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get the value of fullName.
     *
     * @return string
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Get the value of occupation.
     *
     * @return string
     */
    public function getOccupation()
    {
        return $this->occupation;
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

    /**
     * Get the value of image.
     *
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Get the value of bio.
     *
     * @return string
     */
    public function getBio()
    {
        return $this->bio;
    }

    /**
     * Get the value of email.
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Get the value of base.
     *
     * @return string
     */
    public function getBase()
    {
        return $this->base;
    }

    /**
     * Get the value of address.
     *
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Get the value of phone.
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Get the value of resumePdf.
     *
     * @return string
     */
    public function getResumePdf()
    {
        return $this->resumePdf;
    }
}
