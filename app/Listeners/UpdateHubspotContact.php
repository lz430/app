<?php

namespace App\Listeners;

use App\Events\NewPurchaseInitiated;
use DeliverMyRide\HubSpot\Client;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateHubspotContact
{
    private $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * Handle the event.
     *
     * @param  NewPurchaseInitiated  $event
     * @return void
     */
    public function handle(NewPurchaseInitiated $event)
    {
        $this->client->updateContactByEmail(auth()->user()->email, [
            'bodystyle1' => $event->purchase->deal->versions()->first()->body_style,
            'brand1' => $event->purchase->deal->make,
            'model1' => $event->purchase->deal->model,
            'color1' => $event->purchase->deal->color,
            'payment' => 'Finance',
        ]);
    }
}
