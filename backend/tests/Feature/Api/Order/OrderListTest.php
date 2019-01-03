<?php

namespace Tests\Feature\Api\Order;

use App\Models\User;
use Tests\TestCaseWithAuth;
use App\Models\Order\Purchase;

class OrderListTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        $user = factory(User::class)->create();

        factory(Purchase::class, 4)->make()->each(function ($purchase) use ($user) {
            $purchase->status = 'contact';
            $purchase->user_id = $user->id;
            $purchase->save();
        });

        $response = $this->actingAs($user)->json('GET', 'api/order');
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data']);

        $this->assertTrue(count($response->json()['data']) == 4);
    }

    /** @test */
    public function it_rejects_anon()
    {
        factory(User::class)->create();
        $response = $this->json('GET', 'api/order');
        $response->assertStatus(401);
    }

    /** @test */
    public function it_only_returns_my_orders() {
        $user = factory(User::class)->create();
        $user2 = factory(User::class)->create();

        factory(Purchase::class, 3)->make()->each(function ($purchase) use ($user) {
            $purchase->status = 'contact';
            $purchase->user_id = $user->id;
            $purchase->save();
        });

        factory(Purchase::class, 6)->make()->each(function ($purchase) use ($user2) {
            $purchase->status = 'contact';
            $purchase->user_id = $user2->id;
            $purchase->save();
        });

        $this->assertTrue($user->purchases->count() === 3);
        $this->assertTrue($user2->purchases->count() === 6);

        $response = $this->actingAs($user)->json('GET', 'api/order');
        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data']);

        $this->assertTrue(count($response->json()['data']) == 3);
    }
}
