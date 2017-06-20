<?php

namespace Tests\Feature;

use App\Mail\DealPurchasedDMR;
use App\Mail\DealPurchasedUser;
use App\User;
use App\Deal;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PurchaseEmailsTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function sends_emails_to_both_user_and_dmr()
    {
        Mail::fake();

        $user = factory(User::class)->create([
            'email' => 'test@example.com',
        ]);

        $deal = factory(Deal::class)->create();

        $this->be($user);

        $response = $this->post(route('purchase', [
            'deal_id' => $deal->id,
        ]));

        Mail::assertSent(DealPurchasedDMR::class, function (Mailable $mailable) {
            return $mailable->hasTo(config('mail.dmr.address'));
        });

        Mail::assertSent(DealPurchasedUser::class, function (Mailable $mailable) {
            return $mailable->hasTo('test@example.com');
        });

        $response->assertSeeText('Thanks');
    }
}
