<?php

namespace Tests\Feature\API;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use DatabaseMigrations;
    
    /** @test */
    public function it_responds_unprocessable_if_validation_fails()
    {
        $response = $this->postJson(route('users.create'));
        
        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        
        $response->assertJsonFragment(['email' => ["The email field is required."]]);
    }
    
    /** @test */
    public function it_creates_a_new_user_and_sets_the_api_token_if_the_request_is_valid()
    {
        $response = $this->postJson(route('users.create'), ['email' => 'newuser@example.com']);
    
        $response->assertStatus(Response::HTTP_CREATED);
    
        $response->assertSee('apiToken');
    
        $this->assertNotEmpty($response->decodeResponseJson()['data']['attributes']['apiToken']);
    }
}
