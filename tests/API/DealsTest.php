<?php

namespace Tests\Feature;

use App\JATO\Make;
use App\JATO\VehicleModel;
use App\JATO\Version;
use App\VersionDeal;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Symfony\Component\HttpFoundation\Response;
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
}
