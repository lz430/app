<?php
namespace Tests\Feature\Api;
use App\Mail\UserCreated;
use Tests\TestCaseWithAuth;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

class AuthRegistrationTest extends TestCaseWithAuth
{

    /** @test */
    public function it_works()
    {
        Mail::fake();


        //
        // Create User
        $payload = [
            'first_name' => 'Matt',
            'last_name' => 'Wisner',
            'email' => 'mattwisner1@gmail.com',
            'password' => '1234',
            'password_confirmation' => '1234',
        ];

        $response = $this->json('POST', 'api/auth/registration', $payload);
        $response->assertStatus(201);

        //
        // Confirm welcome email
        Mail::assertSent(UserCreated::class, function (Mailable $mailable) use ($payload) {
            return $mailable->hasTo($payload['email']);
        });
    }

}