<?php

namespace App\Listeners;

use App\Events\NewUserRegistered;
use DeliverMyRide\HubSpot\Client;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateHubspotContact
{
    private $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }
    
    public function handle(NewUserRegistered $event)
    {
        $payload = [];
        
        if ($event->user->email) {
            $payload['email'] = $event->user->email
        }
    
        if ($event->user->phone) {
            $payload['phone'] = $event->user->phone;
        }
        
        if ($event->user->name) {
            $names = explode(' ', $event->user->name);
            if ($names[0]) {
                $payload['firstname'] = $names[0];
            }
            if ($names[1]) {
                $payload['lastname'] = $names[1];
            }
        }
        
        if ($hubspot_id = session()->get('hubspot_id')) {
            $this->client->updateContactByHubspotId($hubspot_id, $payload);
            return;
        }
        
        $response = $this->client->createContact($payload);
        session(['hubspot_id' => $response['vid']]);
    }
}
