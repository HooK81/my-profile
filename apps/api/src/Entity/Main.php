<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * Main.
 *
 * @see Profile
 */
class Main
{
    protected string $lastName;
    protected string $firstName;
    protected string $fullName;
    protected string $occupation;
    protected string $description;
    protected string $image;
    protected string $bio;
    protected string $email;
    protected string $base;
    protected Address $address;
    protected string $phone;
    protected string $website;
    protected string $resumePdf;

    /**
     * @var Network[]
     */
    protected array $networks;

    public function __construct()
    {
        $this->address = new Address();
        $this->networks = [];
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): self
    {
        $this->fullName = $fullName;

        return $this;
    }

    public function getOccupation(): string
    {
        return $this->occupation;
    }

    public function setOccupation(string $occupation): self
    {
        $this->occupation = $occupation;

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

    public function getImage(): string
    {
        return $this->image;
    }

    public function setImage(string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getBio(): string
    {
        return $this->bio;
    }

    public function setBio(string $bio): self
    {
        $this->bio = $bio;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getBase(): string
    {
        return $this->base;
    }

    public function setBase(string $base): self
    {
        $this->base = $base;

        return $this;
    }

    public function getAddress(): Address
    {
        return $this->address;
    }

    public function setAddress(Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getWebsite(): string
    {
        return $this->website;
    }

    public function setWebsite(string $website): self
    {
        $this->website = $website;

        return $this;
    }

    public function getResumePdf(): string
    {
        return $this->resumePdf;
    }

    public function setResumePdf(string $resumePdf): self
    {
        $this->resumePdf = $resumePdf;

        return $this;
    }

    /**
     * @return Network[]
     */
    public function getNetworks(): array
    {
        return $this->networks;
    }

    public function addNetwork(Network $network): self
    {
        $this->networks[] = $network;

        return $this;
    }

    public function removeNetwork(Network $network): self
    {
        if (($key = array_search($network, $this->networks)) !== false) {
            unset($this->networks[$key]);
        }

        return $this;
    }
}
