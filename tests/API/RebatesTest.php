<?php

namespace Tests\API;

use Tests\TestCase;

class RebatesTest extends TestCase
{
    /** @test */
    public function it_returns_rebates_and_can_add_valid_ones()
    {
//        $response = $this->getJson(route('rebates.getRebates', [
//            'zipcode' => '75703',
//            'vin' => '1FMCU0GD8HUC76968',
//            'selected_rebate_ids' => [],
//        ]));

        // Add a rebate
        $response = $this->getJson(route('rebates.getRebates', [
            'zipcode' => '75703',
            'vin' => '1FMCU0GD8HUC76968',
            'selected_rebate_ids' => [
                131400,
            ],
        ]));

        dump($response->decodeResponseJson()['data']);

        $this->assertNotEmpty($response->decodeResponseJson()['data']);
    }
}
