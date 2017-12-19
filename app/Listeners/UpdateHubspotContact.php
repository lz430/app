<?php

namespace App\Listeners;

use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use DeliverMyRide\HubSpot\Client;
use Exception;

class UpdateHubspotContact
{
    private $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }
    
    public function handle($event)
    {
        try {
            $this->client->createOrUpdateContact($event->payload);
            $this->client->submitBuyNowContactInfoForm($event->payload);
            return;
        } catch (Exception $exception) {
            Bugsnag::notifyException($exception);
        }
    }
}
