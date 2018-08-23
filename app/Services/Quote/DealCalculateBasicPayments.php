<?php

namespace App\Services\Quote;

use App\Models\Deal;

use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;

/**

 */
class DealCalculateBasicPayments {

    private $carletonClient;

    public function __construct(Client $carletonClient)
    {
        $this->carletonClient = $carletonClient;
    }

    private function defaultQuote($strategy)
    {
        $quote = new \stdClass();
        $quote->term = 0;
        $quote->rate = 0;
        $quote->rebate = 0;

        if ($strategy === 'finance') {
            $quote->rate = 4;
            $quote->term = 60;
        }

        return $quote;
    }

    private function buildCashPayment($quote, Deal $deal) {
        $payload = new \stdClass();

        $payment = $deal->prices()->default;
        $payment -= $quote->rebate;

        $payload->term = (int)$quote->term;
        $payload->rate = (float)$quote->rate;
        $payload->rebate = (int)$quote->rebate;
        $payload->down = 0;
        $payload->payment = round($payment, 2);

        return $payload;
    }

    private function buildFinancePayment($quote, Deal $deal) {
        $payload = new \stdClass();

        $price = $deal->prices()->default;
        $price += $deal->dealer->doc_fee;
        $price += $deal->dealer->cvr_fee;
        $price += $price * 0.06;
        $price -= $quote->rebate;

        $down = $price * 0.1;
        $term = $quote->term;
        $annualInterestRate = $quote->rate / 1200;
        $payment = $price - $down;
        $top = pow(  1 + $annualInterestRate, $term);
        $bottom = $top - 1;
        $payment = $payment * $annualInterestRate * ($top / $bottom);
        $payload->term = (int)$quote->term;
        $payload->rate = (float)$quote->rate;
        $payload->rebate = (int)$quote->rebate;
        $payload->down = $down;
        $payload->payment = round($payment, 2);
        return $payload;

    }

    private function buildLeasePayment($quote, Deal $deal) {
        if (!$quote->term) {
            return null;
        }

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
            $payload = new \stdClass();
            $payload->term = (int)$quote->term;
            $payload->rate = (float)$quote->rate;
            $payload->rebate = (int)$quote->rebate;
            $payload->residual = (int)$quote->residual;
            $payload->miles = (int)$quote->miles;
            $payload->down = round($payment[0]['total_amount_at_drive_off'], 2);
            $payload->payment = round($payment[0]['monthly_payment'], 2);
            return $payload;
        }
        return null;
    }

    /**
     * @param Deal $deal
     * @param bool $save
     * @return bool|null|\stdClass
     */
    public function calculateBasicPayments(Deal $deal, bool $save = true) {
        if (!$deal->dealer) {
            return false;
        }

        $quotes = [];
        foreach ($deal->version->quotes()->get() as $quote) {
            $quotes[$quote->strategy] = $quote;
        }

        $payments = new \stdClass();
        $payments->detroit = new \stdClass();

        foreach (['cash', 'finance', 'lease'] as $strategy) {
            if (isset($quotes[$strategy])) {
                $quote = $quotes[$strategy];
            } else {
                $quote = $this->defaultQuote($strategy);
            }

            switch ($strategy) {
                case 'cash':
                    $payments->detroit->cash = $this->buildCashPayment($quote, $deal);
                    break;
                case 'finance':
                    $payments->detroit->finance = $this->buildFinancePayment($quote, $deal);
                    break;
                case 'lease':
                    $payments->detroit->lease = $this->buildLeasePayment($quote, $deal);
                    break;
            }
        }

        $deal->payments = $payments;
        if ($save) {
            $deal->save();
        }

        return $deal->payments;
    }
}
