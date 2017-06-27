<?php

namespace Tests\API;

use App\JATO\Make;
use App\JATO\VehicleModel;
use App\JATO\Version;
use Tests\TestCase;

class VersionsTest extends TestCase
{
    /** @test */
    public function it_returns_a_listing_of_versions_for_a_specific_make_and_body_style()
    {
        $make = factory(Make::class)->create([
            'name' => 'some-make',
        ]);
        $vehicleModel = $make->models()->save(factory(VehicleModel::class)->make());
        $version = $vehicleModel->versions()->save(factory(Version::class)->make([
            'body_style' => 'Cargo Van',
        ]));
        
        $response = $this->getJson(route('versions.index', [
            'make_ids' => [$make->id, 2, 3],
            'body_styles' => ['cargo van', 'pickup'],
        ]));
        
        $response->assertStatus(200);
        
        $this->assertEquals($version->id, $response->decodeResponseJson()['data'][0]['id']);
    }
}
