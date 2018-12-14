<?php

namespace App\Services\Health\Checks;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use App\Services\Health\HealthCheck;
use GuzzleHttp\Exception\ClientException;

class JatoCheck extends HealthCheck
{
    /**
     * Client factory.
     * @return JatoClient
     */
    public function getClient() : JatoClient
    {
        return new JatoClient(
            config('services.jato.username'),
            config('services.jato.password')
        );
    }

    public function run()
    {
        $deal = Deal::where('status', '=', 'available')->inRandomOrder()->first();
        if ($deal) {
            $client = $this->getClient();
            try {
                $response = $client->vin->decode($deal->vin);
                if ($response) {
                    return 'OKAY!';
                }
            } catch (ClientException $e) {
                print_r($e->getMessage());
            }
        }

        return 'FAIL';
    }
}
