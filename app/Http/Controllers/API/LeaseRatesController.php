<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\JatoClient;

use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use DeliverMyRide\Cox\CoxClient;

class LeaseRatesController extends BaseAPIController
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
        foreach($programs as $i => $program) {
            $data = $program->programs[$i]->residuals;
            foreach($data as $d) {
                $terms = null;
                if(count($d->vehicles) > 1) { // if more than one vehicle model exists for a single vin
                    foreach($d->vehicles as $vehicle){
                        if($vehicle->modelCode === $modelCode) {
                            foreach($vehicle->termValues as $length) {
                                if($length->termLength === $tLength){
                                    $terms = $length->percentage;
                                }
                            }
                        }
                    }
                } else {
                    $termValues = $d->vehicles[0]->termValues;
                    foreach($termValues as $value){
                        if($value->termLength === $tLength){
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
            if(!empty($program->programs)){  // revisit when new lease rates populated after first of month
                $tiers = $program->programs[$i]->tiers[$i];
                foreach ($tiers->leaseTerms as $term) {
                    $apr = (($term->adjRate == null) ? null : ((in_array($make, ['Ford', 'Lincoln', 'Jeep'])) ? $term->adjRate : $term->adjRate * 2400)); // math to get the apr number for making lease calculations, cox does not supply apr
                    $leaseData[] = array('termMonths' => $term->length, 'moneyFactor' => (in_array($make, ['Ford', 'Lincoln', 'Jeep'])) ? $term->adjRate / 2400 : $term->adjRate, 'apr' => $apr, 'residualPercent' => $this->getInitialResidualPercent($results, $term->length, $modelCode), 'residuals' => $this->getResiduals($results, $term->length, $modelCode));
                }
            }
        }
        return $leaseData;
    }

    public function getLeaseRates()
    {
        $this->validate(request(), [
            'vin' => 'required|string',
            'modelcode' => 'string',
            'trim' => 'string',
            'model' => 'string',
            'make' => 'string',
            'zipcode' => 'required|string',
        ]);

        $hints = ['TRIM' => request('trim'), 'MODEL' => request('model'), 'MODEL_CODE' => request('modelcode')];
        $manufacturerLeaseResults = $this->client->vehicle->findByVehicleAndPostalcode(request('vin'), request('zipcode'), [9], [$hints])->response; //9 //11 for jeep
        $leaseRates = collect($manufacturerLeaseResults)->first();
        if(!empty($leaseRates->programDealScenarios[0]->programs)) {
            $retrieveLeaseRates = $this->getTiers($leaseRates, request('modelcode'), request('make'));
            return response()->json($retrieveLeaseRates);
        } else {
            $affiliateLeaseResults = $this->client->vehicle->findByVehicleAndPostalcode(request('vin'), request('zipcode'), [11], [$hints])->response;
            $leaseRates = collect($affiliateLeaseResults)->first();
            $retrieveLeaseRates = $this->getTiers($leaseRates, request('modelcode'), request('make'));
            return response()->json($retrieveLeaseRates);
        }

        /*if(empty($manufacturerLeaseResults->programDealScenarios[0]->programs)) {
            $affiliateLeaseResults = $this->client->vehicle->findByVehicleAndPostalcode(request('vin'), request('zipcode'), [11], [$hints])->response;
            $leaseRates = collect($affiliateLeaseResults)->first();
            $retrieveLeaseRates = $this->getTiers($leaseRates, request('modelcode'), request('make'));
            return response()->json($retrieveLeaseRates);
        } else {
            $leaseRates = collect($manufacturerLeaseResults)->first();
            $retrieveLeaseRates = $this->getTiers($leaseRates, request('modelcode'), request('make'));
            return response()->json($retrieveLeaseRates);
        }*/
    }
}
