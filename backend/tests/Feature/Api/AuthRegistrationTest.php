<?php
namespace Tests\Feature\Api;
use Tests\TestCaseWithAuth;

class AuthRegistrationTest extends TestCaseWithAuth
{

    /** @test */
    public function it_works()
    {
        $payload = [
            'first_name' => 'Matt',
            'last_name' => 'Wisner',
            'email' => 'mattwisner1@gmail.com',
            'password' => '1234',
            'password_confirmation' => '1234',
        ];

        $response = $this->json('POST', 'api/auth/registration', $payload);
        $response->assertStatus(201);
    }

}