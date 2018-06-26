<?php

namespace App\Transformers;

use App\Models\Deal;
use League\Fractal\TransformerAbstract;

class DealQuoteTransformer extends TransformerAbstract
{
    private $ratesAndRebates;
    private $meta;

    public function getData($params)
    {

        $data = collect($params);
        $data = $data['results'];
        return $data;
    }

    public function getRatesForLeases()
    {
        $data = $this->ratesAndRebates;
        $terms = $data->leaseTerms;
        $months = [];
        foreach ($terms as $term) {
            $months[] = [
                'moneyFactor' => isset($term->Factor) ? $term->Factor : $term->Rate / 2400,
                'rate' => isset($term->Rate) ? $term->Rate : null,
                'residualPercent' => $this->getInitialResidualPercent($term->QualifyingTermEnd),
                'termLength' => $term->QualifyingTermEnd,
                'residuals' => $this->getResiduals($term->QualifyingTermEnd)
            ];
        }
        return $months;
    }

    /**
     * @param $timeFrame
     * @return array
     */
    public function getResiduals(string $timeFrame)
    {
        $data = $this->ratesAndRebates;
        $residuals = [];
        foreach ($data->leaseMiles as $mile => $terms) {
            $rates = null;
            foreach ($terms as $time => $percent) {
                if ($time == $timeFrame) {
                    $rates = $percent;
                }
            }

            $residuals[] = [
                'annualMileage' => $mile,
                'residualPercent' => $rates
            ];

        }
        return array_values(array_sort($residuals));
    }

    /**
     * @param $params
     * @return mixed
     * Gets the total cash rebates if any exist for the various payment scenarios
     */
    public function getCashRebates($params)
    {
        $data = $this->getData($params);
        $cashRebates = $data->cashRebates;
        return $cashRebates->totalValue;
    }

    /**
     * @param $params
     * @return mixed
     * Gets lease incentive cash from the leaseTerms array if a lease has any CCR applied for the leasing company
     */
    public function getLeaseCash($params)
    {
        $data = $this->getData($params);
        if (isset($data->leaseTerms[0])) {
            $leaseCash = $data->leaseTerms[0];
            return $leaseCash->CCR;
        }

        return 0;
    }

    public function getInitialResidualPercent($timeFrame)
    {
        $initialPercent = $this->getResiduals($timeFrame);
        return ($initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    public function incentives($params)
    {
        if (!isset($params['results'])) {
            return false;
        }

        if (in_array($params['paymentType'], ['cash', 'finance'])) {
            return $this->getCashRebates($params);
        }

        if ($params['paymentType'] === 'lease') {
            $leaseData = $this->getRatesForLeases($params);
            $cashValue['totalValue'] = $this->getCashRebates($params) + $this->getLeaseCash($params); // TODO : sloppy, fix
            $array = [
                'rates' => $leaseData,
                'cash' => $cashValue
            ];
            return $array;
        }
    }

    /**
     * Build Rebates
     * @return array
     */
    private function rebates()
    {
        $data = [
            'total' => 0,
            'everyone' => [],
            'conditional' => [],
            'lease' => [],
        ];

        if (isset($this->ratesAndRebates->cashRebates) && $this->ratesAndRebates->cashRebates->totalValue) {
            $data['total'] = $this->ratesAndRebates->cashRebates->totalValue;
            $data['everyone'] = $this->ratesAndRebates->cashRebates;
        }

        if (isset($this->ratesAndRebates->leaseTerms[0]) && $this->ratesAndRebates->leaseTerms[0]->CCR) {
            $data['lease'] = $this->ratesAndRebates->leaseTerms[0];
            $data['total'] += $this->ratesAndRebates->leaseTerms[0]->CCR;
        }

        return $data;
    }

    /**
     *
     */
    private function rates() {
       $data = null;

       if ($this->meta->paymentType === 'lease') {
           $data = $this->getRatesForLeases();
       }


       return $data;
    }

    /**
     * @param $ratesAndRebates
     * @param $meta
     * @return array|bool|mixed
     */
    public function transform($ratesAndRebates, $meta)
    {
        $this->ratesAndRebates = $ratesAndRebates;

        $this->meta = $meta;

        $data = [];
        $data['meta'] = [
            'paymentType' => $meta->paymentType,
            'zipcode' => $meta->zipcode,
            'dealId' => $meta->dealId,
        ];

        $data['rebates'] = $this->rebates();
        $data['rates'] = $this->rates();

        return $data;

        $incentives = $this->incentives($params);

        if (!$incentives) {
            return [
                'totalValue' => 0
            ];
        }

        if (in_array($params['paymentType'], ['cash', 'finance'])) {
            return [
                'totalValue' => $this->getCashRebates($params)

            ];
        } else {
            return $this->incentives($params);
        }
    }
}

