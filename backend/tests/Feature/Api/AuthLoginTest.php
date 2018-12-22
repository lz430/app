<?php
namespace Tests\Feature\Api;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            'password' => 'myfakepassword'
        ];

        $response = $this->json('POST', 'api/auth/login', $payload);
        $response
            ->assertJsonStructure(
                [
                    'access_token',
                    'token_type',
                    'expires_at'
                ])->assertStatus(200);
    }

    /** @test */
    public function it_rejects_incorrect_password()
    {
        $user = factory(User::class)->make();
        $user->save();
        $payload = [
            'email' => $user->email,
            'password' => 'wrongpassword'
        ];

        $response = $this->json('POST', 'api/auth/login', $payload);
        $response->assertStatus(401);
    }

}