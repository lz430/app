<?php

namespace App\Listeners;

use App\Events\NewUserRegistered;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
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
        $payload = [
            'email' => $event->user->email ?? '',
            'phone' => $event->user->phone ?? '',
        ];
        
        if ($event->user->name) {
            $names = explode(' ', $event->user->name);
            if (isset($names[0])) {
                $payload['firstname'] = $names[0];
            }
            if (isset($names[1])) {
                $payload['lastname'] = $names[1];
            }
        }
        
        if ($hubspot_id = session()->get('hubspot_id')) {
            try {
                $this->client->updateContactByHubspotId($hubspot_id, $payload);
                return;
            } catch (Exception $exception) {
                Bugsnag::notifyException($exception);
            }
        }
        
        try {
            $response = $this->client->createContact($payload);
            session(['hubspot_id' => $response['vid']]);
        } catch (Exception $exception) {
            Bugsnag::notifyException($exception);
        }
    }
}
