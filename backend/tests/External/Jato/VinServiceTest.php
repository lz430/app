<?php

namespace Tests\External\Jato;

use Tests\TestCase;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;

/**
 * Class testVinService.
 */
class VinServiceTest extends TestCase
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

    /** @test **/
    public function it_can_decode_vin()
    {
        $vin = '1FM5K7B83JGA96934';
        $client = $this->getClient();
        $response = $client->vin->decode($vin);
        $this->assertEquals($response->bodyStyle, '4 Door Sport Utility Vehicle');
    }

    /** @test **/
    public function it_can_validate_valid_vin()
    {
        $vin = '1FM5K7B83JGA96934';
        $client = $this->getClient();
        $response = $client->vin->validate($vin);
        $this->assertEquals($response, 'Valid VIN.');
    }

    /** @test **/
    public function it_can_validate_invaliud_vin()
    {
        $vin = 'savvvffffasdf';
        $client = $this->getClient();

        $exception = false;
        try {
            $client->vin->validate($vin);
        } catch (ClientException $e) {
            self::assertEquals($e->getCode(), 400);
            $exception = true;
        }

        $this->assertTrue($exception);
    }

    /** @test **/
    public function it_can_decode_bulk_vins()
    {
        $vins = ['1FM5K7B83JGA96934', '1C4PJLDX1KD109258'];
        $client = $this->getClient();
        $response = $client->vin->decodeBulk($vins);
        $this->assertEquals(count($response), 2);
    }

    /** @test **/
    public function it_can_decode_vin_features()
    {
        $vinVersionId = '179091';
        $category = 'all';
        $client = $this->getClient();
        $response = $client->vin->decodeVinFeatures($vinVersionId, $category);

        $this->assertTrue(isset($response->categories));
    }
}
