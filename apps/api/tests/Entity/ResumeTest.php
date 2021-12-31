<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Education;
use App\Entity\Resume;
use App\Entity\Skill;
use App\Entity\Work;
use PHPUnit\Framework\TestCase;

final class ResumeTest extends TestCase
{
    public function testLists()
    {
        $resume = new Resume();

        $skill = new Skill();
        $resume->addSkill($skill);
        $this->assertSame($skill, $resume->getSkills()[0]);

        $resume->removeSkill($skill);
        $this->assertEmpty($resume->getSkills());

        $education = new Education();
        $resume->addEducation($education);
        $this->assertSame($education, $resume->getEducations()[0]);

        $resume->removeEducation($education);
        $this->assertEmpty($resume->getEducations());

        $work = new Work();
        $resume->addWork($work);
        $this->assertSame($work, $resume->getWorks()[0]);

        $resume->removeWork($work);
        $this->assertEmpty($resume->getWorks());
    }
}
