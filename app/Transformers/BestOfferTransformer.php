<?php

namespace App\Transformers;

use App\Models\Deal;
use League\Fractal\TransformerAbstract;

class BestOfferTransformer extends TransformerAbstract
{
    private $params = [];

    function __construct($params = [])
    {
        $this->params = $params;
    }

    public function getData($params)
    {
       $data = collect($params);
       $data = $data['results'];
       return $data;
    }

    public function getTermLengths($params)
    {
        $data = $this->getData($params);
        $terms = $data['leaseTerms'];

        $months = [];
        foreach($terms as $term){
            $months[] = $term->QualifyingTermEnd;
        }
        return $months;
    }

    public function getRatesForTerms($params)
    {
        $data = $this->getData($params);
        $terms = $data->leaseTerms;
        $months = [];
        foreach($terms as $term){
            $months[] = array('moneyFactor' => isset($term->Factor) ? $term->Factor : $term->Rate / 2400, 'residualPercent' => $this->getInitialResidualPercent($params, $term->QualifyingTermEnd),'termLength' => $term->QualifyingTermEnd, 'residuals' => $this->getResiduals($params, $term->QualifyingTermEnd));
        }
        return $months;
    }

    public function getResiduals($params, $timeFrame)
    {
        $results = $this->getData($params);
        $residuals = [];

        $programs = $results;
        foreach($programs->leaseMiles as $mile => $terms) {
            $rates = null;
            foreach($terms as $time => $percent){
                if($time == $timeFrame){
                    $rates = $percent;
                }
            }
            $residuals[] = array('annualMileage' => $mile, 'residualPercent' => $rates);
        }
        return array_values(array_sort($residuals));
    }

    public function getCashRebates($params)
    {
        $data = $this->getData($params);
        $cashRebates = $data->cashRebates;
        return $cashRebates->totalValue;
    }

    public function getInitialResidualPercent($params, $timeFrame)
    {
        $initialPercent = $this->getResiduals($params, $timeFrame);
        return ($initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    public function incentives($params)
    {
        if (!isset($params['results'])) {
            return false;
        }

        if(in_array($params['paymentType'], ['cash', 'finance'])){
            return $this->getCashRebates($params);
        }

        if($params['paymentType'] === 'lease'){
            $leaseData = $this->getRatesForTerms($params);
            $cashValue['totalValue'] = $this->getCashRebates($params);
            $array = [
                'rates' => $leaseData,
                'cash' => $cashValue
            ];
            return $array;
        }
    }

    public function transform($params)
    {
        $incentives = $this->incentives($params);

        if (!$incentives) {
            return [
                'totalValue' => 0
            ];
        }

        if(in_array($params['paymentType'], ['cash', 'finance'])){
            return [
                'totalValue' => $this->getCashRebates($params)

            ];
        } else {
            return $this->incentives($params);
        }
    }
}

