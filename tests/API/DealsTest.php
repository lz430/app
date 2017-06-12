<?php

namespace Tests\API;

use App\JATO\Make;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\VersionDeal;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class DealsTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function it_returns_a_listing_of_deals_for_a_specific_make_and_body_style()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        /** @var Version $version */
        $version = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Cargo Van',
        ]));
        $version->deals()->save(factory(VersionDeal::class)->make());
        
        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
            'body_styles' => ['cargo van', 'pickup'],
        ]));

        $response->assertStatus(200);

        $this->assertEquals($version->id, $response->decodeResponseJson()['data'][0]['id']);
    }
    
    /** @test */
    public function it_sorts_based_on_sort_input_string()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        /** @var Version $version */
        $version = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Cargo Van',
        ]));
        $version->deals()->saveMany([
            factory(VersionDeal::class)->make([
                'msrp' => 4000,
            ]),
            factory(VersionDeal::class)->make([
                'msrp' => 1000,
            ]),
        ]);
    
        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
            'body_styles' => ['cargo van', 'pickup'],
            'sort' => 'msrp,-model',
        ]));

        $this->assertEquals($response->decodeResponseJson()['data'][0]['msrp'], 1000);
        $this->assertEquals($response->decodeResponseJson()['data'][1]['msrp'], 4000);
    }

    /** @test */
    public function it_includes_meta_information_for_fuel_types()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        /** @var Version $version */
        $version = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Cargo Van',
        ]));
        $version->deals()->saveMany([
            factory(VersionDeal::class)->make([
                'fuel' => 'fuel type A',
            ]),
            factory(VersionDeal::class)->make([
                'fuel' => 'fuel type B',
            ]),
        ]);

        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
            'sort' => 'price',
        ]));

        $this->assertEquals($response->decodeResponseJson()['meta']['fuelTypes'], ['fuel type A', 'fuel type B']);
    }

    /** @test */
    public function it_filters_by_fuel_type()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        /** @var Version $version */
        $version = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Cargo Van',
        ]));
        $version->deals()->saveMany([
            factory(VersionDeal::class)->make([
                'fuel' => 'fuel type A',
            ]),
            factory(VersionDeal::class)->make([
                'fuel' => 'fuel type B',
            ]),
        ]);

        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
            'sort' => 'price',
            'fuel_type' => 'fuel type B',
        ]));

        $this->assertEquals(1, count($response->decodeResponseJson()['data']));
    }

    /** @test */
    public function it_filters_by_transmission_types()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        /** @var Version $version */
        $version = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Cargo Van',
        ]));
        $version->deals()->saveMany([
            factory(VersionDeal::class)->make([
                'transmission' => '9-Speed 948TE Automatic',
            ]),
            factory(VersionDeal::class)->make([
                'transmission' => '9-Speed Automatic',
            ]),
            factory(VersionDeal::class)->make([
                'transmission' => '6-Speed',
            ]),
        ]);

        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
            'sort' => 'price',
            'transmission_type' => 'manual',
        ]));

        $this->assertEquals(count($response->decodeResponseJson()['data']), 1);
    }

    /** @test */
    public function it_returns_sub_style_deals()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        /** @var Version $version */
        $parentVersion = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Convertible',
        ]));
        $subVersion = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Targa',
        ]));
        $parentVersion->deals()->save(
            factory(VersionDeal::class)->make([
                'id' => 1,
            ])
        );
        $subVersion->deals()->save(
            factory(VersionDeal::class)->make([
                'id' => 2,
            ])
        );

        $response = $this->getJson(route('deals.index', [
            'body_styles' => ['convertible'],
        ]));

        $response->assertStatus(200);

        $this->assertEquals(2, count($response->decodeResponseJson()['data']));
    }
}
