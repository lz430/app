<?php

namespace Tests\API;

use App\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeaturesTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_shows_all_features_that_a_user_can_filter_with()
    {
        // Given 5 features
        factory(Feature::class, 5)->create();

        // And another feature that does not have a group set
        factory(Feature::class)->create([
            'group' => null,
        ]);
        
        // When we request to list the features
        $response = $this->getJson(route('features.index'));
        
        // It is successful
        $response->assertStatus(200);

        // And only 5 features are returned
        $this->assertCount(5, $response->decodeResponseJson()['data']);
    }
}
