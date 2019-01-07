<?php

namespace Tests\Feature\Api\Order;

use Tests\TestCaseWithAuth;
use App\Models\Order\Purchase;
use Buzz\LaravelGoogleCaptcha\CaptchaFacade;

class CheckoutContactTest extends TestCaseWithAuth
{
    /** @test */
    public function it_works()
    {
        CaptchaFacade::shouldReceive('verify')
            ->andReturn(true);

        $purchase = factory(Purchase::class)->make();
        $purchase->status = 'cart';
        $purchase->save();
        $jwt = resolve('Tymon\JWTAuth\JWT');
        $token = $jwt->fromSubject($purchase);

        $payload = [
            'purchaseId' => $purchase->id,
            'order_token' => $token,
            'email' => 'mattwisner1@gmail.com',
            'first_name' => 'Matt',
            'last_name' => 'Wisner',
            'phone_number' => '2312251102',
            'g_recaptcha_response' => 'asdf',
            'drivers_license_state' => 'MI',
            'drivers_license_number' => 'S530781383338',
        ];

        $response = $this
            ->json('POST', 'api/checkout/'.$purchase->id.'/contact', $payload);
        $response
            ->assertStatus(200)
            ->assertJsonStructure(
                [
                    'userToken',
                    'destination',
                    'purchase',
                ]
            );
    }
}
