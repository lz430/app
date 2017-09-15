<?php

namespace App\Events;

use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class NewSessionCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $request;

    public function __construct(Request $request)
    {
        $this->$request = $request;
    }
}
