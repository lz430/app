<?php

namespace Tests\API;

use App\User;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class UsersTest extends TestCase
{

    /** @test */
    public function it_responds_unprocessable_if_validation_fails()
    {
        $response = $this->postJson(route('users.store'));
        
        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        
        $response->assertJsonFragment(['email' => ["The email field is required."]]);
    }
    
    /** @test */
    public function it_creates_a_new_user_and_sets_the_api_token_if_the_request_is_valid()
    {
        $response = $this->postJson(route('users.store'), [
            'name' => 'test',
            'email' => 'newuser@example.com',
            'phone_number' => 'test',
        ]);

        $response->assertSee('api_token');
    
        $this->assertNotEmpty($response->decodeResponseJson()['data']['attributes']['api_token']);
    }
    
    /** @test */
    public function it_updates_a_user_if_the_user_policy_allows()
    {
        $user1 = factory(User::class)->create();
        $user2 = factory(User::class)->create();
    
        $response = $this->patchJson(
            route(
                'users.update',
                ['user' => $user2->id]
            ),
            ['name' => 'Sally'],
            ['Authorization' => "Bearer {$user1->api_token}"]
        );
        
        $response->assertStatus(Response::HTTP_FORBIDDEN);
    
        $response = $this->patchJson(
            route(
                'users.update',
                ['user' => $user1->id]
            ),
            ['name' => 'Sally'],
            ['Authorization' => "Bearer {$user1->api_token}"]
        );
    
        $response->assertStatus(Response::HTTP_OK);
    }
}
