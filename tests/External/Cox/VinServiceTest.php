<?php

namespace Tests\External\Cox;

use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;

use DeliverMyRide\Cox\CoxClient;


class VinServiceTest extends TestCase
{
    /**
     * Client factory
     * @return CoxClient
     */
    public function getClient() : CoxClient {
        return new CoxClient(
            config('services.cox.api_key')
        );
    }

    /** @test **/
    public function it_can_decode_vin() {
        $vin = '1FM5K7B83JGA96934';

        $client = $this->getClient();
        $response = $client->vin->decode($vin);

        $this->assertArrayHasKey(0, $response->response);
    }

}