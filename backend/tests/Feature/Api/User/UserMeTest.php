<?php

namespace Tests\Feature\Api\User;

use App\Models\User;
use Tests\TestCaseWithAuth;

class UserMeTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        $user = factory(User::class)->create();
        $response = $this->actingAs($user)->json('GET', 'api/user/me');

        $response
            ->assertStatus(200)
            ->assertJsonStructure(
                [
                    'id',
                    'email',
                ]);

        $this->assertTrue($user->id == $response->json()['id']);
    }

    /** @test */
    public function it_rejects_anon()
    {
        factory(User::class)->create();
        $response = $this->json('GET', 'api/user/me');
        $response->assertStatus(401);
    }
}
