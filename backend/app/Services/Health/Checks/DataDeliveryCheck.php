<?php

namespace App\Services\Health\Checks;

use App\Services\Health\HealthCheck;
use GuzzleHttp\Exception\ClientException;
use DeliverMyRide\DataDelivery\DataDeliveryClient;

class DataDeliveryCheck extends HealthCheck
{
    /**
     * Client factory.
     * @return DataDeliveryClient
     */
    public function getClient() : DataDeliveryClient
    {
        return new DataDeliveryClient(
            config('services.datadelivery.id'),
            config('services.datadelivery.api_key')
        );
    }

    /** @test **/
    public function run()
    {
        $vehicleId = '1430452';
        $zipcode = '48116';
        $search = [
            'ProgramIDs' => '352233',
        ];

        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->totalrate->get($vehicleId, $zipcode, $zipcode, $search);
            if ($response) {
                return 'OKAY!';
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 'FAIL';
    }
}
