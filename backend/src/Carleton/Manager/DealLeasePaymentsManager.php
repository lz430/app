<?php

namespace DeliverMyRide\Carleton\Manager;

use App\Models\Deal;
use App\Models\Dealer;
use DeliverMyRide\Carleton\Client;

/**
 * Gets lease payments for a specific deal with the least amount of info.
 */
class DealLeasePaymentsManager
{
    private $client;
    private $deal;

    public function __construct(Deal $deal, Client $client)
    {
        $this->deal = $deal;
        $this->client = $client;
    }

    private function mungeTerms($terms)
    {
        $situations = [];

        foreach ($terms as $term) {
            foreach ($term['residuals'] as $residual) {
                $data = [
                    'length' => (int) $term['termLength'],
                    'mileage' => (int) $residual['annualMileage'],
                    'residual' => (int) $residual['residualPercent'],
                ];

                if (isset($term['rate'])) {
                    $data['rate'] = (float) $term['rate'];
                }

                if (isset($term['moneyFactor'])) {
                    $additionalFactor = $this->getAdditionalFactor();
                    $data['moneyFactor'] = ($additionalFactor != null) ? ($term['moneyFactor'] + $additionalFactor) : $term['moneyFactor'];
                }

                if (! $data['residual']) {
                    continue;
                }

                $situations[] = $data;
            }
        }

        return $situations;
    }

    public function get(
        $terms,
        $rebate = 0,
        $cash_down = 0,
        $role = 'default',
        $tradeAllowance = 0,
        $tradeLien = 0)
    {
        $prices = $this->deal->prices();
        $msrp = $prices->msrp;
        $price = $prices->{$role};
        $terms = $this->mungeTerms($terms);

        return $this->client->getLeasePaymentsFor(
            $cash_down,
            $terms,
            6,
            $this->deal->dealer->acquisition_fee,
            $this->deal->dealer->doc_fee,
            $rebate,
            $this->deal->dealer->registration_fee,
            $this->deal->dealer->cvr_fee,
            $msrp,
            $price,
            null,
            $tradeAllowance,
            $tradeLien
        );
    }

    public function getAdditionalFactor()
    {
        $dealer = Dealer::select('money_factor')->where('dealer_id', $this->deal->dealer_id)->first();

        return $dealer->money_factor;
    }
}
