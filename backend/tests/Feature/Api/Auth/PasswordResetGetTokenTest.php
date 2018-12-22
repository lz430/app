<?php
namespace Tests\Feature\Api\Auth;

use App\Models\UserPasswordReset;
use Tests\TestCaseWithAuth;
use App\Models\User;

class PasswordResetGetTokenTest extends TestCaseWithAuth
{

    /** @test */
    public function it_works()
    {
        $user = factory(User::class)->create();
        $passwordResetRequest = factory(UserPasswordReset::class)->create(['email' => $user->email]);

        $response = $this->json('GET', 'api/password/find/' . $passwordResetRequest->token);
        $response
            ->assertJsonStructure(['email', 'token'])
            ->assertStatus(200);

    }

}