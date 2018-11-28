<?php

namespace Tests\External\Fuel;

use Tests\TestCase;
use DeliverMyRide\Fuel\FuelClient;

class ProductServiceTest extends TestCase
{
    /**
     * Client factory.
     * @return FuelClient
     */
    public function getClient() : FuelClient
    {
        return new FuelClient(
            config('services.fuel.api_key')
        );
    }

    /** @test **/
    public function it_can_get_product_data()
    {
        $client = $this->getClient();
        $response = $client->product->list();
        $this->assertGreaterThan(1, count($response));
    }
}
