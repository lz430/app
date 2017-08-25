<?php

namespace App\Events;

use App\Purchase;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewPurchaseInitiated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    public function __construct(Purchase $purchase)
    {
        $this->payload = [
            'bodystyle1' => $purchase->deal->versions()->first()->body_style,
            'brand1' => $purchase->deal->make,
            'model1' => $purchase->deal->model,
            'color1' => $purchase->deal->color,
            'dealername' => $purchase->deal->dealer->name,
            'payment' => title_case($purchase->type),
        ];
    }
}
