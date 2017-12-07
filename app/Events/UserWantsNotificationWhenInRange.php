<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class UserWantsNotificationWhenInRange
{
    use Dispatchable, InteractsWithSockets;

    public $email;

    public function __construct($email)
    {
        $this->email = $email;
    }
}
