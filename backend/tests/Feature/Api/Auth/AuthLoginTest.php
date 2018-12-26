<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Tests\TestCaseWithAuth;

class AuthLoginTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        $user = factory(User::class)->make();
        $user->save();
        $payload = [
            'email' => $user->email,
            'password' => 'myfakepassword',
        ];

        $response = $this->json('POST', 'api/auth/login', $payload);
        $response
            ->assertJsonStructure(
                [
                    'access_token',
                    'token_type',
                    'expires_in',
                ])->assertStatus(200);

        $this->assertTrue(strlen($response->json()['access_token']) > 20, "Access token is probably not a token");
    }

    /** @test */
    public function it_rejects_incorrect_password()
    {
        $user = factory(User::class)->make();
        $user->save();
        $payload = [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ];

        $response = $this->json('POST', 'api/auth/login', $payload);
        $response->assertStatus(422);
    }
}
