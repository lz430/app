<?php

namespace App\Services\Quote;

use App\Models\Deal;
use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\Manager\DealLeasePaymentsManager;

class DealBuildBasicPayments
{
    private $carletonClient;

    private const FAKE_LEASE = [
        'term' => 0,
        'rate' => 0,
        'rate_type' => 'factor',
        'rebate' => 0,
        'residual' => 0,
        'miles' => 0,
        'down' => 0,
        'payment' => 5000,
    ];

    public function __construct(Client $carletonClient)
    {
        $this->carletonClient = $carletonClient;
    }

    private function defaultQuote($strategy)
    {
        $quote = new \stdClass();
        $quote->term = 0;
        $quote->rate = 0;
        $quote->rebate = (float) 0;

        if ($strategy === 'finance') {
            $quote->rate = 5;
            $quote->term = 60;
        }

        return $quote;
    }

    private function buildCashPayment($quote, Deal $deal)
    {
        $payload = new \stdClass();

        $payload->term = (int) $quote->term;
        $payload->rate = (float) $quote->rate;
        $payload->rebate = (float) $quote->rebate;

        $payment = DealCalculatePayments::cash($deal, 'default', $quote->rebate);
        $payload->down = $payment->down;
        $payload->payment = $payment->payment;

        return $payload;
    }

    private function buildFinancePayment($quote, Deal $deal)
    {
        $payload = new \stdClass();

        $payload->term = (int) $quote->term;
        $payload->rate = (float) $quote->rate;
        $payload->rebate = (float) $quote->rebate;

        $payment = DealCalculatePayments::finance($deal,
            'default',
            $quote->term,
            $quote->rate,
            $quote->rebate);

        $payload->down = $payment->down;
        $payload->payment = $payment->payment;

        return $payload;
    }

    private function buildLeasePayment($quote, Deal $deal)
    {
        if (! $quote->term) {
            return (object) self::FAKE_LEASE;
        }

        $rates = [
            'termLength' => (int) $quote->term,
            'residuals' => [
                [
                    'annualMileage' => (int) $quote->miles,
                    'residualPercent' => (int) $quote->residual,
                ],
            ],
        ];

        if ($quote->rate_type != 'Factor') {
            $rates['rate'] = (float) $quote->rate;
            $rates['type'] = 'rate';
        } else {
            $rates['moneyFactor'] = (float) $quote->rate;
            $rates['type'] = 'factor';
        }

        $manager = new DealLeasePaymentsManager($deal, $this->carletonClient);
        $payment = $manager->get([$rates], $quote->rebate, 0, 'default');
        if (count($payment)) {
            $payload = new \stdClass();
            $payload->term = (int) $quote->term;
            $payload->rate = (float) $quote->rate;
            $payload->rate_type = $quote->rate_type;
            $payload->rebate = (float) $quote->rebate;
            $payload->residual = (int) $quote->residual;
            $payload->miles = (int) $quote->miles;
            $payload->down = round($payment[0]['total_amount_at_drive_off'], 2);
            $payload->payment = round($payment[0]['monthly_payment'], 2);

            return $payload;
        }

        return (object) self::FAKE_LEASE;
    }

    /**
     * @param Deal $deal
     * @param bool $save
     * @return bool|null|\stdClass
     */
    public function calculateBasicPayments(Deal $deal, bool $save = true)
    {
        if (! $deal->dealer) {
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
