<?php

namespace Tests\Api;

use App\JATO\VehicleModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleModelsRequestTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_shows_the_vehicle_models_data()
    {
        factory(VehicleModel::class)->create([
            'name' => 'somename',
        ]);
        
        $response = $this->get(route('vehicleModels.index'));
        
        $response->assertJsonFragment(['name' => 'somename']);
        $response->assertJsonFragment(['type' => 'models']);
    }
}
