<?php

namespace Tests\Feature\Api;

use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MakesRequestTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_shows_the_makes_data()
    {
        factory(Make::class)->create([
            'name' => 'dodge',
        ]);
        
        $response = $this->get(route('makes.index'));
        
        $response->assertJsonFragment(['name' => 'dodge']);
        $response->assertJsonFragment(['type' => 'makes']);
        $response->assertJsonFragment(['logo' => '']);
    }

    /** @test */
    public function it_includes_models_data_if_requested_via_query_parameters()
    {
        $make = factory(Make::class)->create([
            'name' => "BMW",
        ]);
        
        factory(VehicleModel::class)->create([
            'name' => 'i8',
            'make_id' => $make->id,
        ]);
        
        $response = $this->get(route('makes.index', ['includes' => 'models']));
        
        $response->assertJsonStructure([
            'data' => [
                [
                    'type',
                    'attributes',
                    'relationships',
                ],
            ],
            'included' => [
                [
                    'type',
                ],
            ],
        ]);
        $response->assertJsonFragment(['name' => 'BMW']);
        $response->assertJsonFragment(['name' => 'i8']);
        $response->assertJsonFragment(['type' => 'makes']);
        $response->assertJsonFragment(['type' => 'models']);
    }

    /** @test */
    public function it_shows_the_body_styles_data()
    {
        $response = $this->get(route('bodyStyles.index'));

        $response->assertJsonFragment(['style' => 'Coupe']);
    }
}