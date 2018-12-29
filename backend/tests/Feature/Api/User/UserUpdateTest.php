<?php

namespace Tests\Feature\Api\Auth;

use App\Mail\UserCreated;
use App\Models\User;
use Tests\TestCaseWithAuth;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

class UserUpdateTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        Mail::fake();

        $user = factory(User::class)->create();

        //
        // Create User
        $payload = [
            'first_name' => 'Matt',
            'last_name' => 'Wisner',
            'email' => 'mattwisner1@gmail.com',
            'password' => '1234',
            'password_confirmation' => '1234',
        ];

        $response = $this->actingAs($user)->json('POST', 'api/user/update', $payload);
        $response->assertStatus(200);
    }
}
