<?php

namespace Tests\Feature;

use App\Mail\SendRepBuyRequest;
use App\Mail\SendUserBuyRequest;
use App\SavedVehicle;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class BuyRequestTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function sends_emails_to_both_user_and_rep()
    {
        Mail::fake();

        $user = factory(User::class)->create();

        $this->be($user);

        $savedVehicle = factory(SavedVehicle::class)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->post(route('buyRequest.store', [
            'savedVehicleId' => $savedVehicle->id,
        ]));

        Mail::assertSent(SendRepBuyRequest::class);
        Mail::assertSent(SendUserBuyRequest::class);

        $this->assertDatabaseHas('buy_requests', [
            'user_id' => $user->id,
            'saved_vehicle_id' => $savedVehicle->id,
        ]);

        $response->assertRedirect(route('buyRequest.thanks'));
    }
}
