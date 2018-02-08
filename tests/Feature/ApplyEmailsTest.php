<?php

namespace Tests\Feature;

use App\JATO\Version;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Purchase;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApplyEmailsTest extends TestCase
{
    use WithoutMiddleware;
    use RefreshDatabase;

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
                        'title' => 'Military',
                        'value' => 1200,
                    ],
                ],
            ]
        );

        $response->assertRedirect(route('request-email', ['payment' => 'cash']));
    }

    /** @test */
    public function requests_email_from_user_if_not_in_session()
    {
        $purchase = factory(Purchase::class)->create();
        $purchase->deal->versions()->save(factory(Version::class)->make());

        $response = $this->post(
            route('applyOrPurchase'),
            [
                'type' => $purchase->type,
                'deal_id' => $purchase->deal_id,
                'dmr_price' => $purchase->dmr_price,
                'msrp' => $purchase->msrp,
                // Rebates.
                'rebates' => [
                    [
                        'title' => 'Military',
                        'value' => 1200,
                    ],
                ],
            ]
        );

        $response->assertRedirect(route('request-email', ['payment' => 'cash']));
    }
}
