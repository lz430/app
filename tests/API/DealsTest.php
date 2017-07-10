<?php

namespace Tests\API;

use App\Dealer;
use App\Feature;
use App\JATO\Make;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\Deal;
use App\Zipcode;
use Illuminate\Support\Fluent;
use Tests\TestCase;

class DealsTest extends TestCase
{
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

        $versionDeals->first()->features()->attach(factory(Feature::class)->make(['feature' => 'ABS']));

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
            $version->deals()->attach($deal->id);
        }

        $deals->first()->features()->attach(factory(Feature::class)->create(['feature' => 'ABS']));

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
            $version->deals()->attach($deal->id);
        }

        $absFeature = factory(Feature::class)->create(['feature' => 'ABS']);
        $heatedSeatsFeature = factory(Feature::class)->create(['feature' => 'Heated seats']);

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

    /** @test */
    public function it_can_restrict_deals_by_distance()
    {
        /**
         * Dealer: Suburban Ford of Ferndale, zipcode: 48220, lat: 42.4511694, lon: -83.1277241
         * Customer: Logan Henson, zipcode: 75703, lat: 32.263116, lon: -95.3072586
         * (75703 DB lookup -> lat: 32.2350970, lon:-95.3207790 )
         * ---
         * Distance from dealer to customer is ~969 miles (Via Google Maps)
         */
        Zipcode::create(['zipcode' => '75703', 'latitude' => '32.2350970', 'longitude' => '-95.3207790']);

        $dealerLatLon = (new Fluent)->latitude(42.4511694)->longitude(-83.1277241);
        $customerZipcode = (new Fluent)->zipcode('75703');

        $dealer = factory(Dealer::class)->create([
            'latitude' => $dealerLatLon->latitude,
            'longitude' => $dealerLatLon->longitude,
        ]);

        $make = factory(Make::class)->create(['name' => 'some-make']);
        $model = $make->models()->save(factory(VehicleModel::class)->make());
        $version = $model->versions()->save(factory(Version::class)->make());

        $deal = factory(Deal::class)->create([
            'dealer_id' => $dealer->dealer_id,
        ]);

        $version->deals()->attach($deal->id);

        /**
         * When max_delivery_miles = 1000
         */
        $dealer->max_delivery_miles = 1000;
        $dealer->save();

        $response = $this->getJson(route('deals.index', [
            'zipcode' => $customerZipcode->zipcode,
        ]));

        $this->assertCount(1, $response->decodeResponseJson()['data']);

        /**
         * When max_delivery_miles = 900
         */
        $dealer->max_delivery_miles = 900;
        $dealer->save();

        $response = $this->getJson(route('deals.index', [
            'zipcode' => $customerZipcode->zipcode,
        ]));

        $this->assertCount(0, $response->decodeResponseJson()['data']);
    }
}
