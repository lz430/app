<?php

namespace Tests\Unit;

use App\JATO\Equipment;
use App\JATO\Make;
use App\JATO\Manufacturer;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\JATO\Option;
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
            $promise->resolve((new Response)->withBody(stream_for(
                file_get_contents(__DIR__ . '/stubs/modelsVersionsByModelName.json')
            )));
        });

        $client = Mockery::mock(Client::class, [
            'manufacturers' => json_decode(file_get_contents(__DIR__ . '/stubs/manufacturers.json'), true),
            'makesByManufacturerUrlName' => json_decode(
                file_get_contents(__DIR__ . '/stubs/makesByManufacturerUrlName.json'),
                true
            ),
            'modelsByMakeName' => json_decode(file_get_contents(__DIR__ . '/stubs/modelsByMakeName.json'), true),
            'optionsByVehicleId' => json_decode(file_get_contents(__DIR__ . '/stubs/optionsByVehicleId.json'), true),
            'equipmentByVehicleId' => json_decode(
                file_get_contents(__DIR__ . '/stubs/equipmentByVehicleId.json'),
                true
            ),
            'modelsVersionsByModelNameAsync' => $promise,
        ]);

        App::instance(Client::class, $client);

        $this->app->make(Kernel::class)->handle(
            new ArrayInput(['command' => 'jato:load']),
            $output = new BufferedOutput
        );

        $this->assertGreaterThanOrEqual(1, Manufacturer::where('name', 'test manufacturer')->count());
        $this->assertGreaterThanOrEqual(1, Make::where('name', 'test make')->count());
        $this->assertGreaterThanOrEqual(1, VehicleModel::where('name', 'test model')->count());
        $this->assertGreaterThanOrEqual(1, Version::where('name', 'test version')->count());
        $this->assertGreaterThanOrEqual(1, Equipment::where('name', 'test equipment')->count());
        $this->assertGreaterThanOrEqual(1, Option::where('name', 'test option')->count());
        $this->assertGreaterThanOrEqual(1, VersionTaxAndDiscount::where('name', 'test tax')->count());
    }
}
