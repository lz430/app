<?php

namespace Tests\Feature;

use App\Mail\DealPurchasedDMR;
use App\Mail\DealPurchasedUser;
use App\Purchase;
use App\User;
use App\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class OnlyCreatesOnePurchaseTest extends TestCase
{
    use WithoutMiddleware;
    use RefreshDatabase;

    /** @test */
    public function only_creates_one_purchase_with_multiple_buy_requests()
    {
        $deal = factory(Deal::class)->create();

        $this->post(route('applyOrPurchase', [
            'type' => 'cash',
            'deal_id' => $deal->id,
            'dmr_price' => '10000',
            'msrp' => '12000',
            'rebates' => [],
        ]));

        $this->assertEquals(1, Purchase::count());

        $this->post(route('applyOrPurchase', [
            'type' => 'cash',
            'deal_id' => $deal->id,
            'dmr_price' => '10000',
            'msrp' => '12000',
            'rebates' => [],
        ]));

        $this->assertEquals(1, Purchase::count());
    }
}
