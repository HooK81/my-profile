<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Profile.
 * Contains all data for a user profile.
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Profile
{
    /**
     * @JMS\Type("string")
     */
    protected string $id;

    /**
     * @JMS\Type("App\Entity\Main")
     */
    protected Main $main;

    /**
     * @JMS\Type("App\Entity\Resume")
     */
    protected Resume $resume;

    /**
     * @JMS\Type("array<App\Entity\Hobby>")
     *
     * @var Hobby[]
     */
    protected array $hobbies;

    /**
     * @JMS\Type("array<App\Entity\Tech>")
     *
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

    /**
     * Get the value of id.
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Get the value of main.
     */
    public function getMain(): Main
    {
        return $this->main;
    }

    /**
     * Get the value of resume.
     */
    public function getResume(): Resume
    {
        return $this->resume;
    }

    /**
     * Get the value of hobbies.
     *
     * @return Hobby[]
     */
    public function getHobbies(): array
    {
        return $this->hobbies;
    }

    /**
     * Get the value of techs.
     *
     * @return Tech[]
     */
    public function getTechs(): array
    {
        return $this->techs;
    }
}
