<?php

declare(strict_types=1);

namespace App\Tests\Traits;

use App\Entity\Security\User;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

trait LoggedUserTrait
{
    public function setLoggedUser(KernelBrowser $client): void
    {
        $client->loginUser(new User('fakeUser', 'fakePwd'));
    }
}
