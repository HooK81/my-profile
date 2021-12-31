<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Address;
use App\Entity\Main;
use App\Entity\Network;
use PHPUnit\Framework\TestCase;
use Symfony\Component\PropertyAccess\PropertyAccess;

final class MainTest extends TestCase
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
        $main = new Main();

        $propertyAccessor->setValue($main, $key, $value);
        $this->assertSame($value, $propertyAccessor->getValue($main, $key));
    }

    public function gettersAndSettersProvider()
    {
        return [
            ['lastName', 'lastName'],
            ['firstName', 'firstName'],
            ['fullName', 'fullName'],
            ['occupation', 'occupation'],
            ['description', 'description'],
            ['image', 'image'],
            ['bio', 'bio'],
            ['email', 'email'],
            ['base', 'base'],
            ['address', new Address()],
            ['phone', 'phone'],
            ['webSite', 'webSite'],
            ['resumePdf', 'resumePdf'],
        ];
    }

    public function testNetworks(): void
    {
        $main = new Main();

        $network = new Network();
        $main->addNetwork($network);
        $this->assertSame($network, $main->getNetworks()[0]);

        $main->removeNetwork($network);
        $this->assertEmpty($main->getNetworks());
    }
}
