<?php

namespace App\Services\Health\Checks;
use App\Services\Health\HealthCheck;
use DeliverMyRide\Carleton\Client;
use GuzzleHttp\Exception\ClientException;

class CarletonCheck extends HealthCheck {

    /**
     * Client factory
     * @return CarletonClient
     */
    public function getClient() : Client {
        return new Client(
            config('services.carleton.url'),
            config('services.carleton.username'),
            config('services.carleton.password')
        );
    }

    public function run()
    {
       try {
           $client = $this->getClient();
           $data = [
               'username' => config('services.carleton.username'),
               'password' => config('services.carleton.password'),
               'quotes' => [],
           ];
           $response = $client->buildRequest($data);
           if($response){
               return 'OKAY!';
           }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 'FAIL';
    }
}

