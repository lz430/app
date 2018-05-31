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
        $data = [];
        $modelCodes = [];
        // gets residual data for best price
        foreach($results->programDealScenarios as $lease) {
            $residuals = $lease->programs[0]->residuals[1];
            $data['annualMileage'] = $residuals->miles;
            $data['residualPercent'] = 58;
            foreach($residuals->vehicles as $vehicle) {
                $modelCodes[] = $vehicle->modelCode;
            }
        }
        if(in_array($params['model_code'], $modelCodes)) {
            //return
        }

        return $data;


    }

    /**
     * @param params
     * Generates formatted incentive pricing for payment scenarios
     */

    public function incentives($params)
    {
        $results = $params['results']->response[0];
        if(in_array($params['paymentType'], ['cash', 'finance'])){
            foreach($results->cashDealScenarios as $cash) {
                return $cash->consumerCash;
            }
        }
        if($params['paymentType'] === 'lease'){
            $details = [];
            $totals = [];
            // gets lease length and money factor
            foreach($results->programDealScenarios as $lease) {
                $details[] = $lease->programs[0]->tiers[0]->leaseTerms;
                foreach($details as $tier) {
                    $totals['moneyFactor'] = $tier[2]->adjRate;
                    $totals['residualPercentage'] = 66;
                    $totals['residuals']['annualMileage'] = 10000;
                    $totals['residuals']['residualPercent'] = 66;
                }
            }
            $residuals = [];
            // gets residual data for best price
            foreach($results->programDealScenarios as $lease) {
                $residuals[] = $lease->programs[0]->residuals[1];
            }

            return $totals;
        }
    }

    public function transform($params)
    {
        $incentives = $this->incentives($params);
        //return $incentives;
        if(in_array($params['paymentType'], ['cash', 'finance'])){
            return [
                'totalValue' => $incentives->totalConsumerCash
            ];
        } else {
            return [
                'rates' => [
                    $this->incentives($params)
                ]
            ];
        }
    }
}

