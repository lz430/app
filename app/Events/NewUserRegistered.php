<?php

namespace App\Events;

use App\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class NewUserRegistered
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
