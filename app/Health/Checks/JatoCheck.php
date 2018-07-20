<?php

namespace App\Health\Checks;
use App\Health\HealthCheck;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;

class JatoCheck extends HealthCheck
{
    /**
     * Client factory
     * @return JatoClient
     */
    public function getClient() : JatoClient {
        return new JatoClient(
            config('services.jato.username'),
            config('services.jato.password')
        );
    }

    /** @test **/
    public function run() {
        $vin = '1FM5K7B83JGA96934';
        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->vin->decode($vin);
            if($response){
                return true;
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }
        return false;

    }

}