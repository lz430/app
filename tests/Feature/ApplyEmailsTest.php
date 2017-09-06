<?php

namespace Tests\Feature;

use App\JATO\Version;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Purchase;
use App\User;
use App\Deal;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApplyEmailsTest extends TestCase
{
    /** @test */
    public function sends_emails_to_both_user_and_dmr()
    {
        Mail::fake();

        $user = factory(User::class)->create([
            'email' => 'test@example.com',
        ]);

        $purchase = factory(Purchase::class)->create();

        $this->be($user);

        $response = $this->post(route('apply', [
            'name' => 'test',
            'email' => 'test-application-email@example.com',
            'purchase_id' => $purchase->id,
        ]));

        Mail::assertSent(ApplicationSubmittedDMR::class, function (Mailable $mailable) {
            return $mailable->hasTo(config('mail.dmr.address'));
        });

        Mail::assertSent(ApplicationSubmittedUser::class, function (Mailable $mailable) {
            return $mailable->hasTo('test-application-email@example.com');
        });

        $response->assertSeeText('Thanks');
    }

    /** @test */
    public function uses_email_from_session_if_it_exists()
    {
        $purchase = factory(Purchase::class)->create();
        $purchase->deal->versions()->save(factory(Version::class)->make());

        $response = $this->withSession([
            'email' => 'test@example.com',
        ])->post(
            route('applyOrPurchase'),
            [
                'type' => $purchase->type,
                'deal_id' => $purchase->deal_id,
                'dmr_price' => $purchase->dmr_price,
                'msrp' => $purchase->msrp,
                // Rebates.
                'rebates' => [
                    [
                        'rebate' => 'test rebate',
                        'value' => 1200,
                    ],
                ],
            ]
        );

        $response->assertRedirect(route('thank-you', ['method' => 'cash']));
    }
}
