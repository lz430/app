<?php

namespace Tests\Feature\Api\Order;

use App\Models\Deal;
use Tests\TestCaseWithAuth;
use App\Services\Quote\Factories\FakeQuote;
use App\Models\User;

class CheckoutStartTest extends TestCaseWithAuth
{
    private $payload = [];

    public function __construct(?string $name = null, array $data = [], string $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

        $deal = factory(Deal::class)->create();

        $this->payload = [
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
    }

    /** @test */
    public function it_works_as_anon()
    {
        $response = $this
            ->json('POST', 'api/checkout/start', $this->payload);

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

        $response = $this
            ->actingAs($user)
            ->json('POST', 'api/checkout/start', $this->payload);

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
