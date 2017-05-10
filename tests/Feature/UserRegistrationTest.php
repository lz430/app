<?php

namespace Tests\Feature;

use App\JATO\Version;
use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class UserRegistrationTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function it_creates_a_user_and_saves_a_vehicle()
    {
        // Given a vehicle version
        $version = factory(Version::class)->create();

        // When a visitor attempts to save the vehicle
        $parameters = [
            'email' => 'somenewuser@example.com',
            'version_id' => $version->id
        ];
        
        $response = $this->post(route('savedVehicle.store'), $parameters);
        
        // The user is created
        $this->assertDatabaseHas('users', ['email' => 'somenewuser@example.com']);
        
        // The user has an API token
        $this->assertNotEmpty(User::where('email', 'somenewuser@example.com')->first()->api_token);
        
        // The vehicle is saved
        $this->assertDatabaseHas('saved_vehicles', ['version_id' => $version->id]);
        
        // The post is successful and redirects the user
        $response->assertRedirect(route('home'));
    }
}
