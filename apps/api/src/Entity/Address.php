<?php

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
     *
     * @var string
     */
    protected $street;

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
    protected $zip;

    /**
     * @JMS\Type("string")
     *
     * @var string
     */
    protected $country;

    /**
     * Get the value of street.
     *
     * @return string
     */
    public function getStreet()
    {
        return $this->street;
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
     * Get the value of zip.
     *
     * @return string
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * Get the value of country.
     *
     * @return string
     */
    public function getCountry()
    {
        return $this->country;
    }
}
