<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * Resume.
 */
class Resume
{
    /**
     * @var Work[]
     */
    protected array $works;

    /**
     * @var Education[]
     */
    protected array $educations;

    /**
     * @var Skill[]
     */
    protected array $skills;

    public function __construct()
    {
        $this->works = [];
        $this->educations = [];
        $this->skills = [];
    }

    /**
     * @return Skill[]
     */
    public function getSkills(): array
    {
        return $this->skills;
    }

    public function addSkill(Skill $skill): self
    {
        $this->skills[] = $skill;

        return $this;
    }

    public function removeSkill(Skill $skill): self
    {
        if (($key = array_search($skill, $this->skills)) !== false) {
            unset($this->skills[$key]);
        }

        return $this;
    }

    /**
     * @return Education[]
     */
    public function getEducations(): array
    {
        return $this->educations;
    }

    public function addEducation(Education $education): self
    {
        $this->educations[] = $education;

        return $this;
    }

    public function removeEducation(Education $education): self
    {
        if (($key = array_search($education, $this->educations)) !== false) {
            unset($this->educations[$key]);
        }

        return $this;
    }

    /**
     * @return Work[]
     */
    public function getWorks(): array
    {
        return $this->works;
    }

    public function addWork(Work $work): self
    {
        $this->works[] = $work;

        return $this;
    }

    public function removeWork(Work $work): self
    {
        if (($key = array_search($work, $this->works)) !== false) {
            unset($this->works[$key]);
        }

        return $this;
    }
}
