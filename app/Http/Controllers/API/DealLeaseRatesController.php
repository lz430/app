<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\Cox\CoxClient;
use App\Models\Deal;

class DealLeaseRatesController extends BaseAPIController
{

    public $client;

    public function __construct(CoxClient $client)
    {
        $this->client = $client;
    }

    /**
     * @param $results
     * @param $tLength
     * @param $modelCode
     * @return array
     * Gets all residual data from cox for each mileage range
     */
    public function getResiduals($results, $tLength, $modelCode)
    {
        $residuals = [];

        $programs = $results->programDealScenarios;
        foreach ($programs as $i => $program) {
            $data = $program->programs[$i]->residuals;
            foreach ($data as $d) {
                $terms = null;
                if (count($d->vehicles) > 1) { // if more than one vehicle model exists for a single vin
                    foreach ($d->vehicles as $vehicle) {
                        if ($vehicle->modelCode === $modelCode) {
                            foreach ($vehicle->termValues as $length) {
                                if ($length->termLength === $tLength) {
                                    $terms = $length->percentage;
                                }
                            }
                        }
                    }
                } else {
                    $termValues = $d->vehicles[0]->termValues;
                    foreach ($termValues as $value) {
                        if ($value->termLength === $tLength) {
                            $terms = $value->percentage;
                        }
                    }
                }
                $residuals[] = array('annualMileage' => $d->miles, 'residualPercent' => $terms);
            }
        }
        return array_values(array_sort($residuals));
    }

    /**
     * @param $results
     * @param $tLength
     * @param $modelCode
     * @return null
     */
    public function getInitialResidualPercent($results, $tLength, $modelCode)
    {
        $initialPercent = $this->getResiduals($results, $tLength, $modelCode);
        return ($initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    /**
     * @param $results
     * @param $modelCode
     * @return array
     */
    public function getTiers($results, $modelCode, $make)
    {
        $leaseData = [];
        $tiersData = $results->programDealScenarios;
        foreach ($tiersData as $i => $program) {
            if (!empty($program->programs)) {  // revisit when new lease rates populated after first of month
                $tiers = $program->programs[$i]->tiers[$i];
                foreach ($tiers->leaseTerms as $term) {
                    if ($term->adjRate !== 'STD') {
                        $adjRate = floatval($term->adjRate);
                        $isNumberWhat = strlen(strrchr($adjRate, '.')) - 1;
                        $aprRate = null;
                        $moneyFactorRate = null;
                        if ($isNumberWhat > 3) {
                            $aprRate = $adjRate * 2400;
                            $moneyFactorRate = $adjRate;
                        } else {
                            $aprRate = $adjRate;
                            $moneyFactorRate = $adjRate / 2400;
                        }
                        $leaseData[] = array('termMonths' => $term->length, 'moneyFactor' => $moneyFactorRate, 'apr' => $aprRate, 'residualPercent' => $this->getInitialResidualPercent($results, $term->length, $modelCode), 'residuals' => $this->getResiduals($results, $term->length, $modelCode));
                    }
                }
            }
        }
        return $leaseData;
    }

    public function getLeaseRates(Deal $deal)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
        ]);

        $params = [
            'vin' => $deal->vin,
            'model_code' => $deal->model_code,
            'trim' => $deal->version->trim_name,
            'model' => $deal->version->model->name,
            'make' => $deal->version->model->make->name,
            'zipcode' => request('zipcode'),
        ];

        $hints = [
            'TRIM' => $params['trim'],
            'MODEL' => $params['model'],
            'MODEL_CODE' => $params['model_code']
        ];

        $manufacturerLeaseResults = $this->client->vehicle->findByVehicleAndPostalcode($params['vin'], $params['zipcode'], [9], [$hints])->response; //9 //11 for jeep
        $leaseRates = collect($manufacturerLeaseResults)->first();
        if (!empty($leaseRates->programDealScenarios[0]->programs)) {
            $retrieveLeaseRates = $this->getTiers($leaseRates, $params['model_code'], $params['make']);
            return response()->json($retrieveLeaseRates);
        } else {
            $affiliateLeaseResults = $this->client->vehicle->findByVehicleAndPostalcode($params['vin'], $params['zipcode'], [11], [$hints])->response;
            $leaseRates = collect($affiliateLeaseResults)->first();
            $retrieveLeaseRates = $this->getTiers($leaseRates, $params['model_code'], $params['make']);
            return response()->json($retrieveLeaseRates);
        }
    }
}
