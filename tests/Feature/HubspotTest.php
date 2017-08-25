<?php

namespace Tests\Feature;

use App\Events\NewPurchaseInitiated;
use App\Events\NewUserRegistered;
use App\Purchase;
use App\User;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class HubspotTest extends TestCase
{
    /** @test */
    public function it_fires_the_events_to_create_and_update_hubspot_contacts()
    {
        Event::fake();
        
        $user = User::create();
        $this->actingAs($user);
        
        factory(Purchase::class)->create([
            'user_id' => $user->id,
        ]);
        
        $this->post('receive-email', ['email' => 'test@example.com']);

        Event::assertDispatched(NewUserRegistered::class);
        Event::assertDispatched(NewPurchaseInitiated::class);
    }
}
