<?php

namespace Tests\Feature\Api\Order;

use App\Models\Deal;
use App\Models\User;
use Tests\TestCaseWithAuth;
use App\Services\Quote\Factories\FakeQuote;

class CheckoutStartTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works_as_anon()
    {
        $deal = factory(Deal::class)->create();

        $payload = [
            'deal_id' => $deal->id,
            'strategy' => 'lease',
            'quote' => (new FakeQuote())->get(),
            'amounts' => (object) [
                'role' => 'dmr',
                'price' => '21926.00',
                'leased_annual_mileage' => 10000,
                'term' => 36,
                'monthly_payment' => '121.62',
                'down_payment' => '2283.66',
            ],
            'trade' => (object) [
                'value' => 0,
                'owed' => 0,
                'estimate' => null,
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

    /** @test */
    public function it_works_as_logged_in_user()
    {
        $user = factory(User::class)->create();
        $deal = factory(Deal::class)->create();

        $payload = [
            'deal_id' => $deal->id,
            'strategy' => 'lease',
            'quote' => (new FakeQuote())->get(),
            'amounts' => (object) [
                'role' => 'dmr',
                'price' => '21926.00',
                'leased_annual_mileage' => 10000,
                'term' => 36,
                'monthly_payment' => '121.62',
                'down_payment' => '2283.66',
            ],
            'trade' => (object) [
                'value' => 0,
                'owed' => 0,
                'estimate' => null,
            ],
        ];
        $response = $this
            ->actingAs($user)
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
