<?php

namespace Tests\External\DataDelivery;

use DeliverMyRide\DataDelivery\DataDeliveryClient;
use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;


class vehicleProgramServiceTest extends TestCase
{
    /**
     * Client factory
     * @return DataDeliveryClient
     */
    public function getClient() : DataDeliveryClient {
        return new DataDeliveryClient(
            config('services.datadelivery.id'),
            config('services.datadelivery.api_key')
        );
    }

    /** @test **/
    public function it_can_get_program_data() {
        $vin = '1C4RJFAG5JC424261';
        $zipcode = '48116';

        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->programdata->get($vin, $zipcode);
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }
        print "\n\n";

        //print_r($response->Affinities->Affinity[0]->attributes()['affinityID'][0]);

        $this->assertTrue((bool) $response);
    }

}