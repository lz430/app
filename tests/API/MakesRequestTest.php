<?php

namespace API;

use App\JATO\Make;
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
        
        $response = $this->get('api/v1/makes');
        
        $response->assertJsonFragment(['name' => 'BMW']);
        $response->assertJsonFragment(['type' => 'makes']);
    }
}
