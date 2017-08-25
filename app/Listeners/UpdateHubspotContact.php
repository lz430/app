<?php

namespace App\Listeners;

use DeliverMyRide\HubSpot\Client;

class UpdateHubspotContact
{
    private $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }
    
    public function handle($event)
    {
        if ($hubspot_id = session()->get('hubspot_id')) {
            try {
                $this->client->updateContactByHubspotId($hubspot_id, $event->payload);
                return;
            } catch (Exception $exception) {
                Bugsnag::notifyException($exception);
            }
        }
    }
}
