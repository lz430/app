<?php

namespace App\Console\Commands;

use App\Services\Quote\DealQuote;


use DeliverMyRide\Carleton\Client;

use DeliverMyRide\DataDelivery\DataDeliveryClient;
use Illuminate\Console\Command;
use App\Models\Deal;

class DealCalculatePayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:dealpayments';


    private $dataDeliveryClient;
    private $carletonClient;

    public function __construct(DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        parent::__construct();
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $deals = Deal::all();

        foreach ($deals as $deal) {
            $payments = new \stdClass();
            $payments->detroit = new \stdClass();

            foreach (['cash', 'finance', 'lease'] as $paymentType) {
                $quote = (new DealQuote($this->dataDeliveryClient, $this->carletonClient))
                    ->get(
                        $deal,
                        '48116',
                        $paymentType,
                        ['default']
                    );

                //$payments->detroit->{$paymentType} = new \stdClass();
                //$payments->detroit->{$paymentType}->quote = $quote;

                if ($paymentType == 'lease') {
                    if (isset( $quote['payments'][0]['monthly_payment'])) {
                        $payments->detroit->{$paymentType} = (float) round($quote['payments'][0]['monthly_payment'], 2);
                    }
                } elseif ($paymentType == 'finance') {
                    $payments->detroit->{$paymentType} = (float) round($deal->prices()->default / 60, 2);
                } else {
                    $payments->detroit->{$paymentType} = (float) $deal->prices()->default - $quote['rebates']['everyone']['total'];
                }
            }

            $deal->payments = $payments;
            $deal->save();
            $this->info($deal->title());
        }
    }
}
