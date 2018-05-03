<?php

namespace App\Listeners;

use \Exception;
use DeliverMyRide\HubSpot\Client;

class NotifyHubspotUserWhenInRange
{
    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function handle($event)
    {
        try {
            $this->client->notifyUserWhenInRange($event);
        } catch (Exception $exception) {
            if (app()->bound('sentry')) {
                app('sentry')->captureException($exception);
            }
        }
    }
}
