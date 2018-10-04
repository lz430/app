<?php

namespace App\Listeners;

use DeliverMyRide\HubSpot\HubspotClient;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

class UpdateHubspotContact
{
    private $client;
    
    public function __construct(HubspotClient $client)
    {
        $this->client = $client;
    }

    /**
     * This is used by both the set-email end point (which is not a purchase) as well as the purchase form.
     * @param $event
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function handle($event)
    {
        try {
            if (isset($event->payload['from'])) {
                unset($event->payload['from']);
            }



            $this->client->contacts()->createOrUpdate($event->payload['email'], $event->payload);
            return;
        } catch (ClientException $e) {
            Log::info($e->getMessage());

            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
        }
    }
}