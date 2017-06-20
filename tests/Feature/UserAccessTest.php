<?php

namespace Tests\Feature;

use App\JATO\Version;
use App\Mail\SendGarageLink;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class UserAccessTest extends TestCase
{
    use DatabaseMigrations;

    public function saved_car_creates_new_user_and_redirected_to_home()
    {
        Mail::fake();

        $version = factory(Version::class)->create();

        $response = $this->post(route('savedVehicle.store', [
            'email' => 'logan@tighten.co',
            'version_id' => $version->id,
        ]));

        Mail::assertSent(SendGarageLink::class);

        $this->assertDatabaseHas('users', [
            'email' => 'logan@tighten.co',
        ]);

        $response->assertRedirect(route('home'));
    }

    /** @test */
    public function existing_user_can_login_via_token_one_time()
    {
        Mail::fake();

        factory(User::class)->create([
            'email' => 'logan@tighten.co',
        ]);

        $this->post('/login', [
            'email' => 'logan@tighten.co',
        ]);

        $url = null;
        Mail::assertSent(SendGarageLink::class, function (Mailable $mail) use (&$url) {
            return $url = $mail->url;
        });

        $response = $this->get($url);
        $response->assertRedirect(route('home'));

        $this->assertDatabaseMissing('email_logins', [
            'email' => 'logan@tighten.co',
            'token' => basename($url),
        ]);
    }
}
