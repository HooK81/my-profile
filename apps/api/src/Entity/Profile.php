<?php

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
     *
     * @var string
     */
    protected $id;

    /**
     * @JMS\Type("App\Entity\Main")
     *
     * @var Main
     */
    protected $main;

    /**
     * @JMS\Type("App\Entity\Resume")
     *
     * @var Resume
     */
    protected $resume;

    /**
     * @JMS\Type("array<App\Entity\Hobby>")
     *
     * @var Hobby[]
     */
    protected $hobbies;

    /**
     * @JMS\Type("array<App\Entity\Tech>")
     *
     * @var Tech[]
     */
    protected $techs;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->main = new Main();
        $this->Resume = new Resume();
        $this->hobbies = [];
        $this->techs = [];
    }

    /**
     * Get the value of id.
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get the value of main.
     *
     * @return Main
     */
    public function getMain()
    {
        return $this->main;
    }

    /**
     * Get the value of resume.
     *
     * @return Resume
     */
    public function getResume()
    {
        return $this->resume;
    }

    /**
     * Get the value of hobbies.
     *
     * @return Hobby[]
     */
    public function getHobbies()
    {
        return $this->hobbies;
    }

    /**
     * Get the value of techs.
     *
     * @return Tech[]
     */
    public function getTechs()
    {
        return $this->techs;
    }
}
