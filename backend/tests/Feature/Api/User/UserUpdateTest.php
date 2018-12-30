<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Tests\TestCaseWithAuth;

class UserUpdateTest extends TestCaseWithAuth
{
    /** @test */
    public function it_updates_basic_info()
    {
        $user = factory(User::class)->create();

        //
        //
        $payload = [
            'first_name' => 'Smith',
            'last_name' => 'Wisner',
            'email' => 'mattwisner1@gmail.com',
            'phone_number' => '231-225-1102',
        ];

        $response = $this->actingAs($user)->json('POST', 'api/user/update', $payload);
        $response
            ->assertStatus(200)
            ->assertJsonStructure(
                ['id', 'first_name', 'last_name', 'email', 'phone_number']
            )
        ->assertJsonFragment($payload);
    }

    /** @test */
    public function it_does_not_allow_duplicate_emails()
    {
        $user = factory(User::class)->create();
        $userTwo = factory(User::class)->create();

        //
        //
        $payload = [
            'first_name' => 'Smith',
            'last_name' => 'Wisner',
            'email' => $userTwo->email,
        ];

        $response = $this->actingAs($user)->json('POST', 'api/user/update', $payload);
        $response
            ->assertStatus(422)
            ->assertJson(
                ['errors' => ['form' => 'Email address already in use']]
            );
    }

    /** @test */
    public function it_rejects_invalid_current_password()
    {
        $user = factory(User::class)->create();

        $payload = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'current_password' => 'wrongpassword',
            'password' => '1234',
            'password_confirmation' => '1234',
        ];

        $response = $this
            ->actingAs($user)
            ->json('POST', 'api/user/update', $payload);

        $response
            ->assertStatus(422)
            ->assertJson(
                ['errors' => ['form' => 'Current password is incorrect']]
            );
    }

    /** @test */
    public function it_updates_password_successfully()
    {
        $user = factory(User::class)->create();

        $payload = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'current_password' => 'myfakepassword',
            'password' => '1234',
            'password_confirmation' => '1234',
        ];

        $response = $this
            ->actingAs($user)
            ->json('POST', 'api/user/update', $payload);

        $response
            ->assertStatus(200)
            ->assertJsonStructure(
                ['id', 'first_name', 'last_name', 'email']
            );
    }
}
