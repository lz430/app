<?php

namespace Tests\External\Cox;

use GuzzleHttp\Exception\ClientException;
use Tests\TestCase;

use DeliverMyRide\RIS\RISClient;

class HashcodeServiceTest extends TestCase
{
    /**
     * Client factory
     * @return RISClient
     */
    public function getClient() : RISClient {
        return new RISClient(
            config('services.cox.api_key')
        );
    }

    /** @test **/
    public function it_can_get_hashcode_master() {
        $client = $this->getClient();
        $response = $client->hashcode->master();
        $this->assertTrue(!empty($response->response));
    }

    /** @test **/
    public function it_can_get_hashcode_tree() {
        $client = $this->getClient();
        $response = $client->hashcode->tree();
        $this->assertTrue(!empty($response->response->hashcode));
    }

    /** @test **/
    public function it_can_get_hashcode_makes() {
        $client = $this->getClient();
        $response = $client->hashcode->makes();
        $this->assertGreaterThan(5, count($response->response));
    }

}