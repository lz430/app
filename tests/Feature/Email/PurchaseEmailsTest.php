<?php

namespace Tests\Feature;

use App\Mail\DealPurchasedDMR;
use App\Purchase;
use App\User;
use App\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PurchaseEmailsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function sends_emails_to_both_user_and_dmr()
    {
        Mail::fake();

        $user = factory(User::class)->create([
            'email' => 'test@example.com',
            'phone_number' => 'test',
        ]);

        $purchase = factory(Purchase::class)->create();

        $this->be($user);

        $response = $this->post(route('purchase', [
            'purchase_id' => $purchase->id,
        ]));

        Mail::assertSent(DealPurchasedDMR::class, function (Mailable $mailable) {
            return $mailable->hasTo(config('mail.dmr.address'));
        });

        $response->assertSeeText('thank-you');
    }
}
