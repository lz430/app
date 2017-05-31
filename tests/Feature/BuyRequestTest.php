<?php
//
//namespace Tests\Feature;
//
//use App\Mail\SendRepBuyRequest;
//use App\Mail\SendUserBuyRequest;
//use App\SavedVehicle;
//use App\User;
//use App\VersionDeal;
//use Illuminate\Foundation\Testing\DatabaseMigrations;
//use Illuminate\Support\Facades\Mail;
//use Tests\TestCase;
//
//class BuyRequestTest extends TestCase
//{
//    use DatabaseMigrations;
//
//    /** @test */
//    public function sends_emails_to_both_user_and_rep()
//    {
//        Mail::fake();
//
//        $user = factory(User::class)->create();
//        $deal = factory(VersionDeal::class)->create();
//
//        $this->be($user);
//
//        $response = $this->post(route('purchase', [
//            'deal_id' => $deal->id,
//        ]));
//
//        Mail::assertSent(SendRepBuyRequest::class);
//        Mail::assertSent(SendUserBuyRequest::class);
//
//        $this->assertDatabaseHas('buy_requests', [
//            'user_id' => $user->id,
//            'saved_vehicle_id' => $savedVehicle->id,
//        ]);
//
//        $response->assertRedirect(route('buyRequest.thanks'));
//    }
//}
