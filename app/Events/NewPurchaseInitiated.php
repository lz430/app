<?php

namespace App\Events;

use App\Purchase;
use App\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewPurchaseInitiated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    public function __construct(User $user, Purchase $purchase)
    {
        $this->payload = [

            //
            // Buyer Contact Info
            'firstname' => $user->first_name,
            'lastname' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone_number,
            'zip' => $user->zip,

            //
            // Vehicle Info
            'stock' => $purchase->deal->stock_number,
            'vin' => $purchase->deal->vin,
            'bodystyle1' => $purchase->deal->version->body_style,
            'brand' => $purchase->deal->make,
            'model1' => $purchase->deal->model,
            'color1' => $purchase->deal->color,
            'year' => $purchase->deal->year,
            'trim' => $purchase->deal->series,
            'interior_color' => $purchase->interior_color,

            //
            // Dealer Info
            'dealername' => $purchase->deal->dealer->name,
            'dealercontact' => $purchase->deal->dealer->contact_name,
            'dealerphone' => $purchase->deal->dealer->phone,

            //
            // Payment & Pricing
            'payment' => title_case($purchase->type),
            'msrp' => $purchase->deal->msrp,
            'final_sale_price' => $purchase->dmr_price,
            'cash_at_delivery' => $purchase->down_payment,

            'length_of_lease' => $purchase->term,
            'monthly_payment' => $purchase->monthly_payment,

            'credit_approval' => $purchase->application_status,

            'rebates_amount' => $purchase->rebatesTotalValue(),
            'voucher_title' => $purchase->rebatesAsTitle(),
        ];
    }
}
