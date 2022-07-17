<?php

declare(strict_types=1);

namespace App\Mailer;

enum MailContentType
{
    case Text;
    case Html;
}
