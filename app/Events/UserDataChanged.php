<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserDataChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $payload;
    
    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }
}
