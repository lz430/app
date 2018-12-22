<?php
namespace Tests\Feature\Api\Auth;
use App\Mail\UserCreated;
use App\Mail\UserPasswordResetRequest;
use Tests\TestCaseWithAuth;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class PasswordResetRequestTest extends TestCaseWithAuth
{

    /** @test */
    public function it_works()
    {
        Mail::fake();

        $user = factory(User::class)->make();
        $user->save();

        //
        // Create User
        $payload = [
            'email' => $user->email,
        ];

        $response = $this->json('POST', 'api/password/create', $payload);
        $response
            ->assertJsonStructure(['message'])
            ->assertStatus(200);

        //
        // Email was sent
        Mail::assertSent(UserPasswordResetRequest::class, function (Mailable $mail) use ($payload) {
            return $mail->hasTo($payload['email']);
        });
    }

}