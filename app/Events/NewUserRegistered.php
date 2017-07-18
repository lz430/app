<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class NewUserRegistered
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    
    public function __construct($user)
    {
        $this->user = $user;
    }
}
