<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Log;

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
            Log::info($exception->getMessage());

            if (app()->bound('sentry')) {
                app('sentry')->captureException($exception);
            }
        }
    }
}