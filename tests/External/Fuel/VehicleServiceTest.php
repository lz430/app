<?php

namespace Tests\External\Fuel;


use Tests\TestCase;
use DeliverMyRide\Fuel\FuelClient;

class VehicleServiceTest extends TestCase
{
    /**
     * Client factory
     * @return FuelClient
     */
    public function getClient() : FuelClient {
        return new FuelClient(
            config('services.fuel.api_key')
        );
    }

    /** @test **/
    public function it_can_find_vehicle_id() {
        $client = $this->getClient();
        $response = $client->vehicle->getVehicleId(2018, 'bmw','7-series');
        $this->assertGreaterThan(2, count($response));
    }

    /** @test **/
    public function it_can_find_media() {
        $client = $this->getClient();
        $response = $client->vehicle->vehicleMedia('27033', '', '', 'White');
        $this->assertTrue(isset($response->id));
    }
}