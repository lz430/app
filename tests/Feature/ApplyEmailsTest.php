<?php

namespace Tests\Feature;

use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\User;
use App\VersionDeal;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApplyEmailsTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function sends_emails_to_both_user_and_dmr()
    {
        Mail::fake();

        $user = factory(User::class)->create([
            'email' => 'test@example.com',
        ]);

        $deal = factory(VersionDeal::class)->create();

        $this->be($user);

        $response = $this->post(route('apply', [
            'deal_id' => $deal->id,
        ]));

        Mail::assertSent(ApplicationSubmittedDMR::class, function (Mailable $mailable) {
            return $mailable->hasTo(config('mail.dmr.address'));
        });

        Mail::assertSent(ApplicationSubmittedUser::class, function (Mailable $mailable) {
            return $mailable->hasTo('test@example.com');
        });

        $response->assertSeeText('Thanks');
    }
}
