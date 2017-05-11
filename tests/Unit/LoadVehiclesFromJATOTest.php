<?php

namespace Tests\Unit;

use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\JATO\VersionOption;
use App\JATO\VersionTaxAndDiscount;
use DeliverMyRide\JATO\Client;
use GuzzleHttp\Promise\Promise;
use GuzzleHttp\Psr7\Response;
use function GuzzleHttp\Psr7\stream_for;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\App;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Mockery;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Tests\TestCase;

class LoadVehiclesFromJATOTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function loads_data_properly()
    {
        $promise = new Promise(function () use (&$promise) {
            $promise->resolve((new Response())->withBody(stream_for(json_encode([
                'results' => [[
                    'vehicleId' => 1,
                    'uid' => 1,
                    'modelId' => 1,
                    'modelYear' => 2017,
                    'versionName' => 'test version',
                    'trimName' => 'test trim',
                    'headerDescription' => 'test description',
                    'drivenWheels' => 4,
                    'numberOfDoors' => 4,
                    'transmissionType' => 'Automatic',
                    'msrp' => 20000,
                    'invoice' => 19000,
                    'bodyStyleName' => 'test body style',
                    'photoPath' => '/test/photo/path',
                    'fuelEconCity' => 20,
                    'fuelEconHwy' => 25,
                    'manufacturerCode' => 'TEST',
                    'delivery' => 500,
                    'isCurrent' => true,
                ]]]))));
        });

        $client = Mockery::mock(Client::class, [
            'manufacturers' => [[
                'manufacturerName' => 'test manufacturer',
                'urlManufacturerName' => 'test-manufacturer',
                'isCurrent' => true,
            ]],
            'makesByManufacturerUrlName' => [[
                'makeName' => 'test make',
                'urlMakeName' => 'test-make',
                'isCurrent' => true,
            ]],
            'modelsByMakeName' => [[
                'modelName' => 'test model',
                'urlModelName' => 'test-model',
                'isCurrent' => true,
            ]],
            'optionsByVehicleId' => [
                'taxes' => [[
                    'item1' => 'test tax',
                    'item2' => 100
                ]],
                'options' => [[
                    'optionId' => 1,
                    'optionName' => 'test option',
                    'optionState' => 'Available',
                    'optionDescription' => 'a test option',
                    'optionCode' => 'TEST',
                    'optionType' => 'O',
                    'msrp' => 500,
                    'invoicePrice' => 400,
                ]],
            ],
            'modelsVersionsByModelNameAsync' => $promise,
        ]);

        App::instance(Client::class, $client);

        $this->app->make(Kernel::class)->handle(
            new ArrayInput(['command' => 'jato:load']),
            new BufferedOutput()
        );

        $this->assertGreaterThanOrEqual(1, Manufacturer::where('name', 'test manufacturer')->count());
        $this->assertGreaterThanOrEqual(1, Make::where('name', 'test make')->count());
        $this->assertGreaterThanOrEqual(1, VehicleModel::where('name', 'test model')->count());
        $this->assertGreaterThanOrEqual(1, Version::where('name', 'test version')->count());
        $this->assertEquals(100, VersionTaxAndDiscount::where('name', 'test tax')->first()->amount);
        $this->assertEquals(500, VersionOption::where('name', 'test option')->first()->msrp);
    }
}
