<?php

namespace App\Console\Commands;

use App\Services\Quote\DealQuote;


use DeliverMyRide\Carleton\Client;

use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;
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

            foreach (['cash', 'finance', 'lease'] as $strategy) {
                $quote = $deal->version->quotes->where('strategy', $strategy)->get(0);
                if (!$quote) {
                    continue;
                }

                switch ($strategy){
                    case 'cash':
                        $payment = $deal->prices()->default;
                        $payment += $deal->dealer->doc_fee;
                        $payment += $deal->dealer->cvr_fee;
                        $payment += $payment * 0.06;
                        $payment -= $quote->rebates;
                        $payments->detroit->cash->term = $quote->term;
                        $payments->detroit->cash->rate = $quote->rate;
                        $payments->detroit->cash->down = 0;
                        $payments->detroit->cash->payment = round($payment, 2);
                        break;
                    case 'finance':
                        $price = $deal->prices()->default;
                        $price += $deal->dealer->doc_fee;
                        $price += $deal->dealer->cvr_fee;
                        $price += $price * 0.06;
                        $price -= $quote->rebates;

                        $down = $price * 0.1;
                        $term = $quote->term;

                        $annualInterestRate = $quote->rate / 1200;

                        $payment = ($price - $down) *
                            ((($annualInterestRate) *
                                    pow(1 + $annualInterestRate, $term)) /
                                (pow(1 + $annualInterestRate, $term) - 1));

                        $payments->detroit->finance->term = $quote->term;
                        $payments->detroit->finance->rate = $quote->rate;
                        $payments->detroit->finance->down = $down;
                        $payments->detroit->finance->payment = round($payment, 2);
                        break;
                    case 'lease':
                        $rates = [

                        ];
                        $manager = new DealLeasePaymentsManager($deal, $this->carletonClient);
                        return $manager->get($data['rates'], $quote->rebates, [0], 'default');
                        break;
                }


                if ($strategy == 'lease') {
                    if (isset( $quote['payments'][0]['monthly_payment'])) {
                        $payments->detroit->{$paymentType} = (float) round($quote['payments'][0]['monthly_payment'], 2);
                    }
                } elseif ($strategy == 'finance') {
                    $payments->detroit->{$strategy} = (float) round($deal->prices()->default / 60, 2);
                } else {
                    $payments->detroit->{$strategy} = (float) $deal->prices()->default - $quote['rebates']['everyone']['total'];
                }
            }

            $deal->payments = $payments;
            $deal->save();
            $this->info($deal->title());
        }
    }
}
