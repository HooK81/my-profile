<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Address.
 *
 * @see Profile
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Address
{
    /**
     * @JMS\Type("string")
     */
    protected ?string $street;

    /**
     * @JMS\Type("string")
     */
    protected ?string $city;

    /**
     * @JMS\Type("string")
     */
    protected ?string $zip;

    /**
     * @JMS\Type("string")
     */
    protected ?string $country;

    /**
     * Get the value of street.
     */
    public function getStreet(): ?string
    {
        return $this->street;
    }

    /**
     * Get the value of city.
     */
    public function getCity(): ?string
    {
        return $this->city;
    }

    /**
     * Get the value of zip.
     */
    public function getZip(): ?string
    {
        return $this->zip;
    }

    /**
     * Get the value of country.
     */
    public function getCountry(): ?string
    {
        return $this->country;
    }
}
