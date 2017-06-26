<?php

namespace Tests\API;

use App\JATO\VehicleModel;
use Tests\TestCase;

class VehicleModelsRequestTest extends TestCase
{
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
