<?php

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Resume.
 *
 * @see Resume
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class Resume
{
    /**
     * @JMS\Type("array<App\Entity\Work>")
     *
     * @var Work[]
     */
    protected $works;

    /**
     * @JMS\Type("array<App\Entity\Education>")
     *
     * @var Education[]
     */
    protected $educations;

    /**
     * @JMS\Type("array<App\Entity\Skill>")
     *
     * @var Skill[]
     */
    protected $skills;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->works = [];
        $this->educations = [];
        $this->skills = [];
    }

    /**
     * Get the value of skills.
     *
     * @return Skill[]
     */
    public function getSkills()
    {
        return $this->skills;
    }

    /**
     * Get the value of educations.
     *
     * @return Education[]
     */
    public function getEducations()
    {
        return $this->educations;
    }

    /**
     * Get the value of works.
     *
     * @return Work[]
     */
    public function getWorks()
    {
        return $this->works;
    }
}
