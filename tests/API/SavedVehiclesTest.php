<?php

namespace API;

use App\SavedVehicle;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class SavedVehiclesTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function it_returns_unauthorized_if_no_api_token_is_passed_in_the_authorization_header()
    {
        $response = $this->getJson(route('savedVehicles.index'));
        $response->assertStatus(401);
    }
    
    /** @test */
    public function it_displays_a_listing_of_saved_vehicles_for_the_authenticated_user()
    {
        $user = factory(User::class)->create();
        $user->savedVehicles()->save(factory(SavedVehicle::class)->make());
        
        $response = $this->getJson(route('savedVehicles.index'),
            ['Authorization' => "Bearer {$user->api_token}"]);
        
        $response->assertStatus(200);
        $response->assertJsonFragment(['version_id' => "1"]);
        $response->assertJsonStructure([
            'data' => [
                [
                    'type',
                    'id',
                    'attributes' => [
                        'version_id',
                    ],
                ],
            ],
        ]);
    }
}
