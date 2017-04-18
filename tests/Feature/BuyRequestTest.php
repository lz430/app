<?php

namespace Tests\Feature;

use App\JATO\Version;
use App\Mail\SendGarageLink;
use App\Mail\SendRepBuyRequest;
use App\Mail\SendUserBuyRequest;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class BuyRequestTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function sends_emails_to_both_user_and_rep()
    {
        Mail::fake();

        $version = factory(Version::class)->create();

        $response = $this->post(route('buyRequest.store', [
            'email' => 'logan@tighten.co',
            'version_id' => $version->id
        ]));

        Mail::assertSent(SendUserBuyRequest::class);
        Mail::assertSent(SendRepBuyRequest::class);

        $response->assertRedirect(route('buyRequest.thanks'));
    }
}
