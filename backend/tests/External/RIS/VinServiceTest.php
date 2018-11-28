<?php

namespace Tests\External\RIS;

use Tests\TestCase;
use DeliverMyRide\RIS\RISClient;

class VinServiceTest extends TestCase
{
    /**
     * Client factory.
     * @return RISClient
     */
    public function getClient() : RISClient
    {
        return new RISClient(
            config('services.cox.api_key')
        );
    }

    /** @test **/
    public function it_can_decode_vin()
    {
        $vin = '1FM5K7B83JGA96934';

        $client = $this->getClient();
        $response = $client->vin->decode($vin);

        $this->assertArrayHasKey(0, $response->response);
    }
}
