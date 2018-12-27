<?php

namespace Tests\Feature\Api\Checkout;

use App\Models\Deal;
use Tests\TestCaseWithAuth;
use App\Services\Quote\Factories\fakeQuote;

class CheckoutStartTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        $deal = factory(Deal::class)->create();

        $payload = [
            'deal_id' => $deal->id,
            'strategy' => 'lease',
            'quote' => (new fakeQuote())->get(),
            'amounts' => (object)[
                "role" => "dmr",
                "price" => "21926.00",
                "leased_annual_mileage" => 10000,
                "term" => 36,
                "monthly_payment" => "121.62",
                "down_payment" => "2283.66"
            ],
            'trade' => (object)[
                "value" => 0,
                "owed" => 0,
                "estimate" => null
            ],
        ];

        $response = $this
            ->json('POST', 'api/checkout/start', $payload);

        $response
            ->assertStatus(200)
            ->assertJsonStructure(
                [
                    'status',
                    'orderToken',
                    'purchase',
                ]
            );
    }
}


