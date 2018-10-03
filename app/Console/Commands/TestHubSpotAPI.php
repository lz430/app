<?php

namespace App\Console\Commands;

use App\Models\Order\Purchase;
use DeliverMyRide\HubSpot\HubspotClient;
use DeliverMyRide\RIS\RISClient;
use Illuminate\Console\Command;
use PHPUnit\Util\PHP\AbstractPhpProcess;
use SevenShores\Hubspot\Factory;

class TestHubSpotAPI extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:hubspot {purchase}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Quick and dirty cox api test';

    /* @var HubspotClient */
    private $client;

    /**
     * Create a new command instance.
 * @param RISClient $client
     * @return void
     */
    public function __construct(HubspotClient $client)
    {
        parent::__construct();
        $this->client = $client;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $purchaseId = $this->argument('purchase');
        $purchase = Purchase::where('id', $purchaseId)->first();
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
            'bodystyle1' => $purchase->deal->version->body_style,
            'brand' => $purchase->deal->make,
            'model1' => $purchase->deal->model,
            'color1' => $purchase->deal->color,
            'year_of_vehicle' => $purchase->deal->year,
            'trim' => $purchase->deal->series,
            //'interior_color' => $purchase->deal->interior_color,
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
            'annual_lease_mileage' => $purchase->lease_mileage ? $purchase->lease_mileage : 0,
            'length_of_lease' => $purchase->term,
            'monthly_payment' => $purchase->monthly_payment,

            'creditapproval' => $purchase->application_status,

            'standard_rebate_amount' => $purchase->rebatesTotalValue(),
            'voucher_title' => $purchase->rebatesAsTitle(),
        ];

        //dd([$purchase->buyer->email, $contactData]);

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
                'dealstage' => 'b7ff253e-1dc8-4a51-b799-be3778bfc8c9',
            ], 'name'),
        ];
        $deal = $client->deals()->create($dealPayload);

    }
}
