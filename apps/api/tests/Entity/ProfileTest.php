<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Hobby;
use App\Entity\Main;
use App\Entity\Profile;
use App\Entity\Resume;
use App\Entity\Tech;
use PHPUnit\Framework\TestCase;
use Symfony\Component\PropertyAccess\PropertyAccess;

final class ProfileTest extends TestCase
{
    /**
     * @dataProvider gettersAndSettersProvider
     */
    public function testGettersAndSetters($key, $value): void
    {
        $propertyAccessor = PropertyAccess::createPropertyAccessorBuilder()
            ->enableExceptionOnInvalidIndex()
            ->getPropertyAccessor()
        ;
        $profile = new Profile();
        $propertyAccessor->setValue($profile, $key, $value);
        $this->assertSame($value, $propertyAccessor->getValue($profile, $key));
    }

    public function gettersAndSettersProvider()
    {
        return [
            ['id', 'ID'],
            ['main', new Main()],
            ['resume', new Resume()],
        ];
    }

    public function testLists(): void
    {
        $profile = new Profile();

        $hobby = new Hobby();
        $profile->addHobby($hobby);
        $this->assertSame($hobby, $profile->getHobbies()[0]);

        $profile->removeHobby($hobby);
        $this->assertEmpty($profile->getHobbies());

        $tech = new Tech();
        $profile->addTech($tech);
        $this->assertSame($tech, $profile->getTechs()[0]);

        $profile->removeTech($tech);
        $this->assertEmpty($profile->getTechs());
    }
}
