<?php

namespace DeliverMyRide\HubSpot;

use SevenShores\Hubspot\Factory;

class HubspotClient extends Factory
{
    public function mungePayloadData($payload, $propName = 'property')
    {
        return array_map(function ($key, $value) use ($propName) {
            return [$propName => $key, 'value' => $value];
        }, array_keys($payload), $payload);
    }
}
