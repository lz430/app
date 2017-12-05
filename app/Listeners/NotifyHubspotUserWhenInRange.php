<?php

namespace App\Listeners;

use App\Events\UserWantsNotificationWhenInRange;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
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
            Bugsnag::notifyException($exception);
        }
    }
}
