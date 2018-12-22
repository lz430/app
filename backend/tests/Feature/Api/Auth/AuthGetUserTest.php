<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Tests\TestCaseWithAuth;
use Laravel\Passport\Passport;

class AuthGetUserTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        $user = factory(User::class)->make();
        $user->save();
        Passport::actingAs($user);

        $payload = [
            'email' => $user->email,
            'password' => 'myfakepassword',
        ];

        $response = $this->json('GET', 'api/auth/user', $payload);
        $response
            ->assertJsonStructure(
                [
                    'first_name',
                    'last_name',
                    'email',
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

        $response = $this->json('GET', 'api/auth/user', $payload);
        $response
            ->assertStatus(401);
    }
}
