<?php

namespace Tests\External\DataDelivery;

use Tests\TestCase;
use GuzzleHttp\Exception\ClientException;
use DeliverMyRide\DataDelivery\DataDeliveryClient;

class VehicleProgramServiceTest extends TestCase
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
    public function it_can_get_program_data()
    {
        $vin = '1FTEW1E52JFC62101';
        $zipcode = '48116';
        $search = [
            'Trim' => 'XL',
            'Year' => '2018',
            'Body' => 'Super Crew',
            'OptionGroup' => 'Base',
        ];

        $client = $this->getClient();
        $response = [];
        try {
            $response = $client->programdata->get($vin, $zipcode, $zipcode, false, $search);
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        $this->assertTrue((bool) $response);
    }
}
