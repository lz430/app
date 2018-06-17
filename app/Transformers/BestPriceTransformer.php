<?php

namespace App\Transformers;

use App\Models\Deal;
use League\Fractal\TransformerAbstract;

class BestPriceTransformer extends TransformerAbstract
{
    private $params = [];

    function __construct($params = [])
    {
        $this->params = $params;
    }

    public function getResiduals($params)
    {
        $results = $params['results']->response[0];
        $residuals = [];

        $programs = $results->programDealScenarios;
        foreach($programs as $i => $program) {
            $data = $program->programs[$i]->residuals;
            foreach($data as $d) {
                $terms = null;
                if(count($d->vehicles) > 1) {
                    foreach($d->vehicles as $vehicle){
                        if($vehicle->modelCode === $params['model_code']) {
                            foreach($vehicle->termValues as $length) {
                                $terms = $length->percentage;
                            }
                        }
                    }
                } else {
                    $termValues = $d->vehicles[0]->termValues;
                    foreach($termValues as $value){
                        $terms = $value->percentage;
                    }
                }
                $residuals[] = array('annualMileage' => $d->miles, 'residualPercent' => $terms);
            }
        }
        return array_values(array_sort($residuals));
    }

    public function getInitialResidualPercent($params)
    {
        $initialPercent = $this->getResiduals($params);
        return ($initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    /**
     * Generates formatted incentive pricing for payment scenarios
     * @param params
     */
    public function incentives($params)
    {
        if (!isset($params['results']->response[0])) {
            return false;
        }

        $results = $params['results']->response[0];

        if(in_array($params['paymentType'], ['cash', 'finance'])){
            foreach($results->cashDealScenarios as $cash) {
                return $cash->consumerCash;
            }
        }

        if($params['paymentType'] === 'lease'){
            $leaseData = [];
            $cashValue = [];
            $tiersData = $results->programDealScenarios;
            foreach($tiersData as $i => $program) {
                if(!empty($program->programs)) { // revisit when new lease rates populated after first of month
                    $tiers = $program->programs[$i]->tiers[$i];
                    $totalLeaseCash = $program->programs[$i]->consumerCash;
                    foreach ($tiers->leaseTerms as $term) {
                        if($term->adjRate !== 'STD') {
                            $adjRate = floatval($term->adjRate);
                            $isNumberWhat = strlen(strrchr($adjRate, '.')) -1;
                            $moneyFactorRate = null;
                            if($isNumberWhat > 3){
                                $moneyFactorRate = $adjRate;
                            } else {
                                $moneyFactorRate = $adjRate / 2400;
                            }
                            $leaseData[] = array('moneyFactor' => $moneyFactorRate, 'residualPercent' => $this->getInitialResidualPercent($params), 'residuals' => $this->getResiduals($params));
                            //$leaseData[] = array('moneyFactor' => (in_array($params['make'], ['Ford', 'Lincoln'])) ? floatval($term->adjRate) / 2400 : floatval($term->adjRate), 'residualPercent' => $this->getInitialResidualPercent($params), 'residuals' => $this->getResiduals($params));
                        }
                    }
                    $cashValue['totalValue'] = $totalLeaseCash->totalConsumerCash;
                }
            }
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
                'totalValue' => $incentives->totalConsumerCash

            ];
        } else {
            return $this->incentives($params);
        }
    }
}

