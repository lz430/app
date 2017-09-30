<?php

namespace Tests\Feature;

use App\Deal;
use App\Dealer;
use App\Events\NewPurchaseInitiated;
use App\Events\UserDataChanged;
use App\JATO\Version;
use App\Listeners\CreateHubspotContact;
use App\Listeners\UpdateHubspotContact;
use App\Purchase;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class HubspotTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_fires_the_events_to_create_and_update_hubspot_contacts()
    {
        Event::fake();
        
        $user = User::create();
        $this->actingAs($user);
        
        $purchase = factory(Purchase::class)->create([
            'user_id' => $user->id,
        ]);
        
        $purchase->deal->versions()->save(factory(Version::class)->make());
        
        $this->withSession(['purchase' => $purchase])->post('receive-email', ['email' => 'test@example.com']);

        Event::assertDispatched(UserDataChanged::class);
        Event::assertDispatched(NewPurchaseInitiated::class);
    }

    /** @test */
    public function it_fires_hubspot_update_events_via_the_hubspot_controller()
    {
        Event::fake();

        $this->session(['hubspot_id' => 1]);

        $this->post('hubspot', ['bodystyle1' => 'test']);

        Event::assertDispatched(UpdateHubspotContact::class);
    }
}
