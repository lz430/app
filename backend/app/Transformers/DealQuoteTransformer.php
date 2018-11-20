<?php

namespace App\Transformers;

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
            $data = [
                'rate' => isset($term->Rate) ? $term->Rate : null,
                'residualPercent' => $this->getInitialResidualPercent($term->QualifyingTermEnd),
                'termLength' => $term->QualifyingTermEnd,
                'residuals' => $this->getResiduals($term->QualifyingTermEnd)
            ];

            if (isset($term->Factor)) {
                $data['moneyFactor'] = $term->Factor;
            } elseif (isset($term->Rate) && is_numeric($term->Rate)) {
                $data['rate'] = $term->Rate;
            }

            if ($data['residualPercent'] && (isset($data['moneyFactor']) || isset($data['rate']))) {
                $months[] = $data;
            }
        }

        //
        // If we have more than 4... start removing
        if (count($months) > 4) {
            foreach ($months as $key => $month) {
                if ($month['termLength'] % 12 !== 0) {
                    unset($months[$key]);
                }

                if (count($months) <= 4) {
                    break;
                }
            }
            $months = array_values($months);
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
        return (isset($initialPercent[0]) && $initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    /**
     *
     */
    private function rates()
    {
        $data = null;

        if ($this->meta->paymentType === 'lease') {
            $data = $this->getRatesForLeases();
        }

        return $data;
    }

    /**
     * @param $ratesAndRebates
     * @param $meta
     * @param array $potentialConditionalRoles
     * @return array
     */
    public function transform($ratesAndRebates, $meta, $potentialConditionalRoles = [])
    {
        $this->ratesAndRebates = $ratesAndRebates;
        $this->meta = $meta;

        $data = [];
        $data['meta'] = (array)$this->meta;
        $data['rebates'] = $ratesAndRebates ? $ratesAndRebates->rebates : false;
        $data['rates'] = $ratesAndRebates ? $this->rates() : false;
        $data['selections'] = [
            'conditionalRoles' => $potentialConditionalRoles
        ];

        return $data;
    }
}

