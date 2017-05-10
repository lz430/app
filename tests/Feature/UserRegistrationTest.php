<?php

namespace Tests\Feature;

use App\JATO\Version;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class UserRegistrationTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function saving_a_vehicle_as_a_new_user_creates_a_user_and_saves_the_vehicle_for_that_user()
    {
        // Given a vehicle version
        $version = factory(Version::class)->create();

        // When a visitor attempts to save the vehicle
        $response = $this->post(route('savedVehicle.store'), [
            'email' => 'somenewuser@example.com',
            'version_id' => $version->id,
        ]);
        
        // The user is created
        $this->assertDatabaseHas('users', ['email' => 'somenewuser@example.com']);
        
        // The user has an API token
        $apiToken = User::where('email', 'somenewuser@example.com')->first()->api_token;
        $this->assertNotEmpty($apiToken);
        
        // The API token is 60 characters long
        $this->assertEquals(60, strlen($apiToken));

        // The vehicle is saved
        $this->assertDatabaseHas('saved_vehicles', ['version_id' => $version->id]);
        
        // The post is successful and redirects the user
        $response->assertRedirect(route('home'));
    }
}
