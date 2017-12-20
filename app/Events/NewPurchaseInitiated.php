<?php

namespace App\Events;

use App\Purchase;
use App\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewPurchaseInitiated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    public function __construct(User $user, Purchase $purchase)
    {
        $this->payload = [
            'firstname' => $user->first_name,
            'lastname' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone_number,
            'zip' => $user->zip,
            'vin' => $purchase->deal->vin,
            'bodystyle1' => $purchase->deal->versions()->first()->body_style,
            'brand' => $purchase->deal->make,
            'model1' => $purchase->deal->model,
            'color1' => $purchase->deal->color,
            'dealername' => $purchase->deal->dealer->name,
            'dealercontact' => $purchase->deal->dealer->contact_name,
            'dealerphone' => $purchase->deal->dealer->phone,
            'payment' => title_case($purchase->type),
        ];
    }
}
