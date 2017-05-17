<?php

namespace Tests\Feature;

use App\JATO\Version;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class VersionsTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function it_returns_a_listing_of_the_vehicle_versions_and_accepts_a_parameter_of_an_array_of_ids()
    {
        factory(Version::class, 10)->create();
        
        $response = $this->getJson(route('versions.index', ['ids' => '1,2,3']));
        
        $response->assertStatus(Response::HTTP_OK);
        $this->assertCount(3, $response->decodeResponseJson()['data']);
    }
}
