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
    protected $signature = 'dmr:dealpayments {deal?}';

    private $dataDeliveryClient;
    private $carletonClient;

    public function __construct(DataDeliveryClient $dataDeliveryClient, Client $client)
    {
        parent::__construct();
        $this->dataDeliveryClient = $dataDeliveryClient;
        $this->carletonClient = $client;
    }

    private function defaultQuote($strategy)
    {
        $quote = new \stdClass();
        $quote->term = 0;
        $quote->rate = 0;
        $quote->rebates = 0;

        if ($strategy === 'finance') {
            $quote->rate = 4;
            $quote->term = 60;
        }

        return $quote;
    }

    private function calculatePayments(Deal $deal)
    {
        $payments = new \stdClass();
        $payments->detroit = new \stdClass();
        $quotes = [];

        if (!$deal->dealer) {
            return false;
        }

        foreach ($deal->version->quotes()->get() as $quote) {
            $quotes[$quote->strategy] = $quote;
        }

        foreach (['cash', 'finance', 'lease'] as $strategy) {
            if (isset($quotes[$strategy])) {
                $quote = $quotes[$strategy];
            } else {
                $quote = $this->defaultQuote($strategy);
            }

            if ($strategy === 'lease' && (!$quote->term)) {
                continue;
            }

            switch ($strategy) {
                case 'cash':
                    $payment = $deal->prices()->default;
                    $payment -= $quote->rebates;
                    $payments->detroit->cash = new \stdClass();
                    $payments->detroit->cash->term = (int)$quote->term;
                    $payments->detroit->cash->rate = (float)$quote->rate;
                    $payments->detroit->cash->rebates = (int)$quote->rebates;
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
                    $payment = $price - $down;
                    $top = pow(  1 + $annualInterestRate, $term);
                    $bottom = $top - 1;
                    $payment = $payment * $annualInterestRate * ($top / $bottom);
                    $payments->detroit->finance = new \stdClass();
                    $payments->detroit->finance->term = (int)$quote->term;
                    $payments->detroit->finance->rate = (float)$quote->rate;
                    $payments->detroit->finance->rebates = (int)$quote->rebates;
                    $payments->detroit->finance->down = $down;
                    $payments->detroit->finance->payment = round($payment, 2);
                    break;
                case 'lease':
                    $rates = [
                        'termLength' => (int)$quote->term,
                        'residuals' => [
                            [
                                'annualMileage' => (int)$quote->miles,
                                'residualPercent' => (int)$quote->residual,
                            ]
                        ],
                    ];

                    if ($quote->rate_type != 'Factor') {
                        $rates['moneyFactor'] = (float)$quote->rate / 2400;
                        $rates['type'] = 'factor';
                    } else {
                        $rates['moneyFactor'] = (float)$quote->rate;
                        $rates['type'] = 'factor';
                    }

                    $manager = new DealLeasePaymentsManager($deal, $this->carletonClient);
                    $payment = $manager->get([$rates], $quote->rebate, [0], 'default');
                    if (count($payment)) {
                        $payments->detroit->lease = new \stdClass();
                        $payments->detroit->lease->term = (int)$quote->term;
                        $payments->detroit->lease->rate = (float)$quote->rate;
                        $payments->detroit->lease->rebates = (int)$quote->rebate;
                        $payments->detroit->lease->residual = (int)$quote->residual;
                        $payments->detroit->lease->miles = (int)$quote->miles;
                        $payments->detroit->lease->down = round($payment[0]['total_amount_at_drive_off'], 2);
                        $payments->detroit->lease->payment = round($payment[0]['monthly_payment'], 2);
                    }
                    break;
            }
        }

        $deal->payments = $payments;
        $deal->save();
        $this->info($deal->title());
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        \DB::connection()->disableQueryLog();

        $dealId = $this->argument('deal');
        if ($dealId) {
            $deal = Deal::where('id', $dealId)->get()->first();
            $this->calculatePayments($deal);

        } else {
            Deal::chunk(500, function ($deals) {
                foreach ($deals as $deal) {
                    $this->calculatePayments($deal);
                }
            });
        }
        return true;
    }
}
