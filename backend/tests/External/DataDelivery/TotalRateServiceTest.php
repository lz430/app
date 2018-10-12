<?php

namespace Tests\External\DataDelivery;

use DeliverMyRide\DataDelivery\DataDeliveryClient;
use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;


class TotalRateServiceTest extends TestCase
{
    /**
     * Client factory
     * @return DataDeliveryClient
     */
    public function getClient() : DataDeliveryClient {
        return new DataDeliveryClient(
            config('services.datadelivery.id'),
            config('services.datadelivery.api_key')
        );
    }

    /** @test **/
    public function it_can_get_total_data() {
        $vehicleId = '1430452';
        $zipcode = '48116';
        $search = [
            'ProgramIDs' => '352233',
        ];

        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->totalrate->get($vehicleId, $zipcode, $zipcode, $search);
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        $this->assertTrue((bool) $response);
    }

}