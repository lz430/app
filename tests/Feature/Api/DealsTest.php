<?php

namespace Tests\Feature\Api;

use App\Models\JatoFeature;
use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;
use App\Models\JATO\Version;
use App\Models\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Feature;

class DealsTest extends TestCase
{
    use RefreshDatabase;

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
        $version->deals()->save(factory(Deal::class)->make());

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
            factory(Deal::class)->make([
                'msrp' => 4000,
            ]),
            factory(Deal::class)->make([
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
            factory(Deal::class)->make([
                'fuel' => 'fuel type A',
            ]),
            factory(Deal::class)->make([
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
            factory(Deal::class)->make([
                'transmission' => '9-Speed 948TE Automatic',
            ]),
            factory(Deal::class)->make([
                'transmission' => '9-Speed Automatic',
            ]),
            factory(Deal::class)->make([
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
            factory(Deal::class)->make([
                'id' => 1,
            ])
        );
        $subVersion->deals()->save(
            factory(Deal::class)->make([
                'id' => 2,
            ])
        );

        $response = $this->getJson(route('deals.index', [
            'body_styles' => ['convertible'],
        ]));

        $response->assertStatus(200);

        $this->assertEquals(2, count($response->decodeResponseJson()['data']));
    }

    /** @test */
    public function it_returns_all_deals_if_no_features()
    {
        $make = factory(Make::class)->create(['name' => 'some-make']);

        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());

        $version = $vehicleModel->versions()->save(factory(Version::class)->make());

        $versionDeals = $version->deals()->saveMany(factory(Deal::class, 3)->make());

        $versionDeals->first()->jatoFeatures()->attach(factory(JatoFeature::class)->create(['feature' => 'ABS']));

        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
        ]));

        $response->assertStatus(200);

        $this->assertCount(3, $response->decodeResponseJson()['data']);
    }

    /** @test */
    public function it_filters_by_feature_string()
    {
        $make = factory(Make::class)->create(['name' => 'some-make']);

        $model = $make->models()->save(factory(VehicleModel::class)->make());
        $version = $model->versions()->save(factory(Version::class)->make());

        $deals = factory(Deal::class, 3)->create();

        foreach ($deals as $deal) {
            $version->deals()->save($deal);
        }

        $feature = factory(Feature::class)->create(['title' => 'ABS']);

        $deals->first()->features()->attach($feature->id);

        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id],
            'features' => ['ABS'],
        ]));

        $this->assertCount(1, $response->decodeResponseJson()['data']);
    }

    /** @test */
    public function it_returns_only_deals_that_have_all_features()
    {
        $make = factory(Make::class)->create(['name' => 'some-make']);
        $model = $make->models()->save(factory(VehicleModel::class)->make());
        $version = $model->versions()->save(factory(Version::class)->make());

        $deals = factory(Deal::class, 3)->create();

        foreach ($deals as $deal) {
            $version->deals()->save($deal);
        }

        $absFeature = factory(Feature::class)->create(['title' => 'ABS']);
        $heatedSeatsFeature = factory(Feature::class)->create(['title' => 'Heated seats']);

        $deals->first()->features()->attach($absFeature);

        $deals->get(1)->features()->attach($heatedSeatsFeature);

        $deals->get(2)->features()->attach($absFeature);
        $deals->get(2)->features()->attach($heatedSeatsFeature);

        $response = $this->getJson(route('deals.index', [
            'make_ids' => [$make->id, 2, 3],
            'includes' => ['features'],
            'features' => ['ABS', 'Heated seats'],
        ]));

        $response->assertStatus(200);

        $this->assertCount(1, $response->decodeResponseJson()['data']);
    }
}
