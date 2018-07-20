<?php

namespace App\Health\Checks;
use App\Health\HealthCheck;
use DeliverMyRide\Fuel\FuelClient;
use GuzzleHttp\Exception\ClientException;

class FuelCheck extends HealthCheck
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
    public function run() {
        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->product->list();
            if($response){
                return true;
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return false;
    }
}