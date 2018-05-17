<?php

namespace Tests\API;

use App\Models\Zipcode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ZipCodesTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_saves_a_posted_zip_code_to_session()
    {
        $code = '12345';

        $response = $this->postJson(route('zipCodes.store', [
            'code' => $code,
        ]));

        $response->assertStatus(200);
        $response->assertSessionHas('zip', $code);
    }

    /** @test */
    public function it_checks_if_zip_code_is_supported()
    {
        $response = $this->getJson(route('zipCodes.show', [
            'code' => '12345',
        ]));

        $response->assertStatus(200);
    }
}
