<?php

namespace DeliverMyRide\HubSpot;

use SevenShores\Hubspot\Factory;

class HubspotClient extends Factory
{
    public function getUrlForDeal($deal)
    {
        return 'https://app.hubspot.com/contacts/'.$deal['portalId'].'/deal/'.$deal['objectId'].'/?interaction=note';
    }

    public function getUrlForContact($contact)
    {
        $contact['portalId'] = '3388780';

        return 'https://app.hubspot.com/contacts/'.$contact['portalId'].'/contact/'.$contact['vid'].'/?interaction=note';
    }

    public function getUrlForTicket($ticket)
    {
        return 'https://app.hubspot.com/contacts/'.$ticket['portalId'].'/ticket/'.$ticket['objectId'].'/?interaction=note';
    }

    public function mungePayloadData($payload, $propName = 'property')
    {
        return array_map(function ($key, $value) use ($propName) {
            return [$propName => $key, 'value' => $value];
        }, array_keys($payload), $payload);
    }
}
