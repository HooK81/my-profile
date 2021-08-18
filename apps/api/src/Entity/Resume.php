<?php

declare(strict_types=1);

namespace App\Entity;

use JMS\Serializer\Annotation as JMS;

/**
 * Resume.
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
    protected array $works;

    /**
     * @JMS\Type("array<App\Entity\Education>")
     *
     * @var Education[]
     */
    protected array $educations;

    /**
     * @JMS\Type("array<App\Entity\Skill>")
     *
     * @var Skill[]
     */
    protected array $skills;

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
    public function getSkills(): array
    {
        return $this->skills;
    }

    /**
     * Get the value of educations.
     *
     * @return Education[]
     */
    public function getEducations(): array
    {
        return $this->educations;
    }

    /**
     * Get the value of works.
     *
     * @return Work[]
     */
    public function getWorks(): array
    {
        return $this->works;
    }
}
