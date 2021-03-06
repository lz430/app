<?php

namespace Tests\Feature\Api\Password;

use App\Models\User;
use Tests\TestCaseWithAuth;
use Illuminate\Mail\Mailable;
use App\Models\UserPasswordReset;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserPasswordResetSuccess;

class PasswordResetResetPasswordTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        Mail::fake();

        $user = factory(User::class)->create();
        $passwordResetRequest = factory(UserPasswordReset::class)->create(['email' => $user->email]);

        $payload = [
            'email' => $user->email,
            'token' => $passwordResetRequest->token,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ];

        //
        // Reset Password
        $response = $this->json('POST', 'api/password/reset', $payload);
        $response
            ->assertJsonStructure(['email', 'id', 'first_name', 'last_name'])
            ->assertStatus(200);

        //
        // Password Reset Confirm
        Mail::assertSent(UserPasswordResetSuccess::class, function (Mailable $mail) use ($payload) {
            return $mail->hasTo($payload['email']);
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
