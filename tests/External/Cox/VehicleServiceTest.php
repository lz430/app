<?php

namespace Tests\External\Cox;

use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;

use DeliverMyRide\Cox\CoxClient;

class VehicleServiceTest extends TestCase
{
    /**
     * Client factory
     * @return CoxClient
     */
    public function getClient() : CoxClient {
        return new CoxClient(
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