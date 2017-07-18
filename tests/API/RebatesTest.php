<?php

namespace Tests\API;

use DeliverMyRide\MarketScan\Client;
use Tests\TestCase;

class RebatesTest extends TestCase
{
    /** @test */
    public function it_can_get_rebates()
    {
        $response = $this->getJson(route('rebates.getRebates', [
            'zipcode' => '75703',
            'vin' => '1FMCU0GD8HUC76968',
        ]));

        $data = $response->decodeResponseJson();

        $this->assertNotEmpty($data['rebates']);
        $this->assertNotEmpty($data['compatibilities']);
    }
}
