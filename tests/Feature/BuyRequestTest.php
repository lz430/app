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

        $response = $this->post(route('buyRequest.store', [
            'savedVehicleId' => factory(SavedVehicle::class)->create([
                'user_id' => $user->id
            ])->id,
        ]));

        Mail::assertSent(SendUserBuyRequest::class);
        Mail::assertSent(SendRepBuyRequest::class);

        $response->assertRedirect(route('buyRequest.thanks'));
    }
}
