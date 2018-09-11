<?php

namespace App\Listeners;

use GuzzleHttp\Exception\ClientException;
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

            $this->client->createOrUpdateContact($event->payload);

            if (isset($event->payload['phone'])) {
                $this->client->submitBuyNowContactInfoForm($event->payload);
            }
            return;
        } catch (ClientException $e) {
            Log::info($e->getMessage());

            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
        }
    }
}