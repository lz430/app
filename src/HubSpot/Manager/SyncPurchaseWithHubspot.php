<?php

namespace DeliverMyRide\HubSpot\Manager;

use App\Models\Order\Purchase;
use DeliverMyRide\HubSpot\HubspotClient;


/**
 *
 */
class SyncPurchaseWithHubspot {
    private $client;
    public function __construct(HubspotClient $client)
    {
        $this->client = $client;
    }

    public function submitPurchaseForm(Purchase $purchase)
    {
        $this->client->forms()->submit('3388780', '9cac9eed-3b2c-4d2f-9bc6-38b0c7b04c2f', [
            [
                'firstname' => $purchase->buyer->first_name,
                'lastname' => $purchase->buyer->last_name,
                'email' => $purchase->buyer->email,
                'phone' => $purchase->buyer->phone_number,
            ]
        ]);
    }

    public function createContactAndDeal(Purchase $purchase) {
        $client = $this->client;

        $contactData = [
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
            'deal_id' => $purchase->deal_id,

            'bodystyle1' => $purchase->deal->version->body_style,
            'brand' => $purchase->deal->make,
            'model1' => $purchase->deal->model,
            'color1' => $purchase->deal->color,
            'year_of_vehicle' => $purchase->deal->year,
            'trim' => $purchase->deal->series,

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
            'annual_lease_mileage' => $purchase->lease_mileage ? $purchase->lease_mileage : 0,
            'length_of_lease' => $purchase->term,
            'monthly_payment' => $purchase->monthly_payment,

            'creditapproval' => $purchase->application_status,

            'standard_rebate_amount' => $purchase->rebatesTotalValue(),
            'voucher_title' => $purchase->rebatesAsTitle(),
        ];


        //
        // Create Or Update contact
        $contact = $client->contacts()->createOrUpdate($purchase->buyer->email, $client->mungePayloadData($contactData));
        $contact = $contact->toArray();

        $dealPayload = [
            'associations' => [
                'associatedVids' => [
                    $contact['vid']
                ]
            ],
            'properties' => $this->client->mungePayloadData([
                'pipeline' => 'default',
                'dealname' => $purchase->deal->title(),
                'dealstage' => 'b8ace084-d202-47df-bca7-3973eb53120a',
                'amount' => '500',

                'vehicle_stock' => $purchase->deal->stock_number,
                'vehicle_vin' => $purchase->deal->vin,
                'vehicle_id' => $purchase->deal_id,
            ], 'name'),
        ];
        $deal = $client->deals()->create($dealPayload);
    }
}