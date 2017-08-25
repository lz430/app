<?php

namespace App\Listeners;

use App\Events\NewSessionCreated;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use DeliverMyRide\HubSpot\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;

class CreateHubspotContact
{
    private $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }
    
    public function handle(NewSessionCreated $event)
    {
        /** @var Request $request */
        $request = $event->request;
        
        $payload = ['ipaddress' => $request->ip()];
    
        try {
            $response = $this->client->createContact($payload);
            session(['hubspot_id' => $response['vid']]);
        } catch (Exception $exception) {
            Bugsnag::notifyException($exception);
        }
    }
}
