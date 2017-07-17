<?php

namespace Tests\API;

use DeliverMyRide\MarketScan\Client;
use Tests\TestCase;

class RebatesTest extends TestCase
{
    /**
     * @group integration
     * @test
     */
    public function it_can_get_rebates()
    {
        $response = $this->getJson(route('rebates.getRebates', [
            'zipcode' => '75703',
            'vin' => '1FMCU0GD8HUC76968',
            'selected_rebate_ids' => [],
        ]));

        $this->assertNotEmpty($response->decodeResponseJson()['compatible_rebates']);
    }

    /** @test */
    public function it_can_select_rebates_accurately()
    {
        $client = new Client;

        $compatibilities = [
            [
                131400,
                131388,
                128013,
            ],
            [
                131400,
                131387,
                128013,
            ],
            [
                131400,
                131387,
                128013,
            ],
            [
                131400,
                131387,
                128013,
            ],
            [
                131397,
                131360,
                104356,
            ],
            [
                131400,
                130056,
            ],
        ];

        [$selectedRebates, $compatibleRebateIds] = $client->selectRebate(
            [
                'id' => 131400,
            ],
            [],
            $compatibilities,
            array_unique(array_flatten($compatibilities))
        );

        sort($selectedRebates);
        $this->assertEquals([
            ['id' => 131400],
        ], $selectedRebates);

        sort($compatibleRebateIds);
        $this->assertEquals([
            128013,
            130056,
            131387,
            131388,
            131400,
        ], array_values($compatibleRebateIds));

        /** Let's select another one */
        [$selectedRebates, $compatibleRebateIds] = $client->selectRebate(
            [
                'id' => 128013,
            ],
            $selectedRebates,
            $compatibilities,
            $compatibleRebateIds
        );

        sort($selectedRebates);
        $this->assertEquals([
            ['id' => 128013],
            ['id' => 131400],
        ], array_values($selectedRebates));

        sort($compatibleRebateIds);
        $this->assertEquals([
            128013,
            131387,
            131388,
            131400,
        ], array_values($compatibleRebateIds));

        /** And the final one in a compatible group */
        [$selectedRebates, $compatibleRebateIds] = $client->selectRebate(
            [
                'id' => 131387,
            ],
            $selectedRebates,
            $compatibilities,
            $compatibleRebateIds
        );

        sort($selectedRebates);
        $this->assertEquals([
            ['id' => 128013],
            ['id' => 131387],
            ['id' => 131400],
        ], array_values($selectedRebates));

        sort($compatibleRebateIds);
        $this->assertEquals([
            128013,
            131387,
            131400,
        ], array_values($compatibleRebateIds));

        /** And finally make sure it is idempotent */
        [$selectedRebates, $compatibleRebateIds] = $client->selectRebate(
            [
                'id' => 131387,
            ],
            $selectedRebates,
            $compatibilities,
            $compatibleRebateIds
        );

        sort($selectedRebates);
        $this->assertEquals([
            ['id' => 128013],
            ['id' => 131387],
            ['id' => 131400],
        ], array_values($selectedRebates));

        sort($compatibleRebateIds);
        $this->assertEquals([
            128013,
            131387,
            131400,
        ], array_values($compatibleRebateIds));
    }

    /** @test */
    public function it_can_select_single_rebate_that_is_not_compatible_with_others()
    {
        $client = new Client;

        $compatibilities = [
            [
                131400,
                131388,
                128013,
            ],
        ];

        [$selectedRebates, $compatibleRebateIds] = $client->selectRebate(
            [
                'id' => 111111,
            ],
            [],
            $compatibilities,
            array_unique(array_flatten($compatibilities))
        );

        sort($selectedRebates);
        $this->assertEquals([
            ['id' => 111111],
        ], $selectedRebates);

        sort($compatibleRebateIds);
        $this->assertEquals([111111], array_values($compatibleRebateIds));
    }
}
