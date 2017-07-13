<?php

namespace Tests\Feature;

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
}
