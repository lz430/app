<?php

namespace Tests\External\RIS;

use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;

use DeliverMyRide\RIS\RISClient;

class VehicleServiceTest extends TestCase
{
    /**
     * Client factory
     * @return RISClient
     */
    public function getClient() : RISClient {
        return new RISClient(
            config('services.cox.api_key')
        );
    }

    /** @test **/
    public function it_can_find_by_vin_and_postal()
    {
        $client = $this->getClient();
        $response = $client->vehicle->findByVehicleAndPostalcode('1FM5K7B83JGA96934', '48116');
        $this->assertTrue(isset($response->response));
    }

}