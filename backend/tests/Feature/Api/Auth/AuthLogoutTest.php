<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Tests\TestCaseWithAuth;

class AuthLogoutTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        $user = factory(User::class)->make();
        $user->save();
        $response = $this->actingAs($user)->json('GET', 'api/auth/logout');
        $response
            ->assertJsonStructure(
                [
                    'message',
                ]
            )
            ->assertStatus(200);
    }

    /** @test */
    public function it_does_not_allow_anon()
    {
        $user = factory(User::class)->make();
        $user->save();

        $payload = [
            'email' => $user->email,
            'password' => 'myfakepassword',
        ];

        $response = $this->json('GET', 'api/auth/logout', $payload);
        $response
            ->assertStatus(401);
    }
}
