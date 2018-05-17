<?php

namespace Tests\External\Jato;

use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;

use DeliverMyRide\JATO\JatoClient;


/**
 * Class testVinService
 * @package Tests\Service\Jato\Integration
 */
class testFeatureService extends TestCase
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
    public function it_can_get_dimensions() {
        $id = '774218220180301';
        $category = 2;
        $client = $this->getClient();

        $vehicle = $client->vehicle->get($id);
        print_r($vehicle);

        //$results = $client->feature->get($id);

        //print_r($results);

    }



}