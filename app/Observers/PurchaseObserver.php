<?php

namespace App\Observers;

use App\Models\Purchase;
use App\Models\Deal;
use App\Policies\PurchasePolicy;

class PurchaseObserver
{
    /**
     * @param Purchase $purchase
     */
    private function onCreatedSyncWithHubspot(Purchase $purchase)
    {
        $client = resolve('DeliverMyRide\HubSpot\HubspotClient');

        //
        // Create Or Update contact
        $contact = $client->contacts()->createOrUpdate($purchase->buyer->email,
            [
                //
                // Buyer Contact Info
                'firstname' => $purchase->buyer->first_name,
                'lastname' => $purchase->buyer->last_name,
                'email' => $purchase->buyer->email,
                'phone' => $purchase->buyer->phone_number,
                'zip' => $purchase->buyer->zip,

                //
                // Vehicle Info
                'stock' => $purchase->deal->stock_number,
                'vin' => $purchase->deal->vin,
                'bodystyle1' => $purchase->deal->version->body_style,
                'brand' => $purchase->deal->make,
                'model1' => $purchase->deal->model,
                'color1' => $purchase->deal->color,
                'year_of_vehicle' => $purchase->deal->year,
                'trim' => $purchase->deal->series,
                'interior_color' => $purchase->interior_color,
                'deal_id' => $purchase->deal_id,
                'dealer_r1_id' => $purchase->deal->dealer->route_one_id,

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
                'downpayment' => $purchase->down_payment,
                'cash_at_delivery' => $purchase->down_payment,
                'annual_lease_mileage' => $purchase->lease_mileage,
                'length_of_lease' => $purchase->term,
                'monthly_payment' => $purchase->monthly_payment,

                'creditapproval' => $purchase->application_status,

                'standard_rebate_amount' => $purchase->rebatesTotalValue(),
                'voucher_title' => $purchase->rebatesAsTitle(),
            ]
        );

        dd($contact);
    }

    /**
     * Handle to the purchase "created" event.
     *
     * @param \App\Models\Purchase $purchase
     * @return void
     */
    public function created(Purchase $purchase)
    {
        //
        // Remove deal from index
        Deal::where('id', $purchase->deal_id)->searchable();

        //
        // Sync with hubspot
        $this->onCreatedSyncWithHubspot($purchase);


    }
}
