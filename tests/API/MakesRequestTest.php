<?php

namespace API;

use App\JATO\Make;
use App\JATO\VehicleModel;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class MakesRequestTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function it_shows_the_makes_data()
    {
        factory(Make::class)->create([
            'name' => "BMW"
        ]);
        
        $response = $this->get(route('makes.index'));
        
        $response->assertJsonFragment(['name' => 'BMW']);
        $response->assertJsonFragment(['type' => 'makes']);
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
                ]
            ],
            'included' => [
                [
                    'type',
                ]
            ]
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
