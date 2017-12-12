<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class UserDataChanged
{
    use Dispatchable, InteractsWithSockets;

    public $payload;

    public function __construct($payload)
    {
        $this->payload = $payload;
    }
}
