<?php

namespace App\Services\Health\Checks;

use DeliverMyRide\Fuel\FuelClient;
use App\Services\Health\HealthCheck;
use GuzzleHttp\Exception\ClientException;

class FuelCheck extends HealthCheck
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
    public function run()
    {
        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->product->list();
            if ($response) {
                return 'OKAY!';
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 'FAIL';
    }
}
