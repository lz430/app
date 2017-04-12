<?php

namespace Tests\Feature;

use DeliverMyRide\JATO\Client;
use Dotenv\Dotenv;
use Tests\TestCase;

/**
 * Tests that the actual JATO API is working
 */
class ClientTest extends TestCase
{
    /** @var $client Client */
    private static $client;

    /**
     * Client instantiation requires OAuth handshake and we don't want to do that for every test
     */
    public static function setUpBeforeClass()
    {
        (new Dotenv(__DIR__ . '/../../../'))->load();

        static::$client = new Client();
    }

    /** @test */
    public function can_get_makes()
    {
        static::$client->makes();
    }

    /** @test */
    public function can_get_models_by_make_name()
    {
        static::$client->modelsByMakeName('Nissan');
    }

    /** @test */
    public function can_get_manufacturers()
    {
        static::$client->manufacturers();
    }

    /** @test */
    public function can_get_makes_by_manufacturer_url_name()
    {
        static::$client->makesByManufacturerUrlName('nissan');
    }

    /** @test */
    public function can_get_model_versions_by_model_name()
    {
        static::$client->modelsVersionsByModelName('xterra');
    }

    /** @test */
    public function can_get_options_by_vehicle_id()
    {
        static::$client->optionsByVehicleId('61539620000131');
    }
}
