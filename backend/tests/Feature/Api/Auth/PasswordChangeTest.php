<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Tests\TestCaseWithAuth;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserPasswordResetSuccess;

class PasswordChangeTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        Mail::fake();

        $user = factory(User::class)->create();

        $payload = [
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ];

        //
        // Reset Password
        $response = $this->actingAs($user)->json('POST', 'api/auth/password', $payload);
        $response
            ->assertJsonStructure(['message'])
            ->assertStatus(200);

        //
        // Password Reset Confirm
        Mail::assertSent(UserPasswordResetSuccess::class, function (Mailable $mail) use ($user) {
            return $mail->hasTo($user->email);
        });

        //
        // Assert user can login with new password
        $loginPayload = [
            'email' => $user->email,
            'password' => $payload['password'],
        ];

        $response = $this->json('POST', 'api/auth/login', $loginPayload);

        $response
            ->assertJsonStructure(
                [
                    'access_token',
                    'token_type',
                    'expires_in',
                ])->assertStatus(200);
    }
}
