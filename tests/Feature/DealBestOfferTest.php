<?php

namespace Tests\Feature;

use App\Deal;
use App\JATO\Version;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class DealBestOfferTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function it_returns_an_error_if_validation_fails()
    {
        $deal = factory(Deal::class)->create();
        $deal->versions()->save(factory(Version::class)->make());

        // Must have proper payment type
        $response = $this->json('GET', route('deals.best-offer', $deal->id), ['payment_type' => 'somethingelse', 'zipcode' => '48203', 'targets' => [25, 26]]);
        $response->assertJsonValidationErrors(['payment_type']);

        // Must have a zip code
        $response = $this->json('GET', route('deals.best-offer', $deal->id), ['payment_type' => 'cash', 'targets' => [25, 26]]);
        $response->assertJsonValidationErrors(['zipcode']);
    }

    /** @test */
    public function it_returns_a_total_value_of_0_if_no_best_offers_found()
    {
        $deal = factory(Deal::class)->create();
        $deal->versions()->save(factory(Version::class)->make());

        $response = $this->json('GET', route('deals.best-offer', $deal->id), ['payment_type' => 'cash', 'targets' => [25,26], 'zipcode' => '99999']);

        $response->assertJsonFragment(['totalValue' => 0]);
    }
}
