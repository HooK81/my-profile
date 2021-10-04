<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * Profile.
 * Contains all data for a user profile.
 */
class Profile
{
    protected string $id;
    protected Main $main;
    protected Resume $resume;

    /**
     * @var Hobby[]
     */
    protected array $hobbies;

    /**
     * @var Tech[]
     */
    protected array $techs;

    public function __construct()
    {
        $this->main = new Main();
        $this->resume = new Resume();
        $this->hobbies = [];
        $this->techs = [];
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getMain(): Main
    {
        return $this->main;
    }

    public function setMain(Main $main): self
    {
        $this->main = $main;

        return $this;
    }

    public function getResume(): Resume
    {
        return $this->resume;
    }

    public function setResume(Resume $resume): self
    {
        $this->resume = $resume;

        return $this;
    }

    /**
     * @return Hobby[]
     */
    public function getHobbies(): array
    {
        return $this->hobbies;
    }

    public function addHobby(Hobby $hobby): self
    {
        $this->hobbies[] = $hobby;

        return $this;
    }

    public function removeHobby(Hobby $hobby): self
    {
        if (($key = array_search($hobby, $this->hobbies)) !== false) {
            unset($this->hobbies[$key]);
        }

        return $this;
    }

    /**
     * @return Tech[]
     */
    public function getTechs(): array
    {
        return $this->techs;
    }

    public function addTech(Tech $tech): self
    {
        $this->techs[] = $tech;

        return $this;
    }

    public function removeTech(Tech $tech): self
    {
        if (($key = array_search($tech, $this->techs)) !== false) {
            unset($this->techs[$key]);
        }

        return $this;
    }
}
