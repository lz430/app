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

    public function getLeaseRates()
    {
        $this->validate(request(), [
            'vin' => 'required|string',
            'zipcode' => 'required|string',
        ]);

        //[{"termMonths":24,"moneyFactor":0.00247083325,"apr":5.93,"residualPercent":64,"residuals":[{"annualMileage":10000,"residualPercent":64},{"annualMileage":12000,"residualPercent":63},{"annualMileage":15000,"residualPercent":62}]},
        //{"termMonths":27,"moneyFactor":0.00247083325,"apr":5.93,"residualPercent":63,"residuals":[{"annualMileage":10000,"residualPercent":63},{"annualMileage":12000,"residualPercent":62},{"annualMileage":15000,"residualPercent":61}]},
        //{"termMonths":36,"moneyFactor":0.00197916664,"apr":4.75,"residualPercent":59,"residuals":[{"annualMileage":10000,"residualPercent":59},{"annualMileage":12000,"residualPercent":58},{"annualMileage":15000,"residualPercent":56}]},
        //{"termMonths":39,"moneyFactor":0.00197916664,"apr":4.75,"residualPercent":57,"residuals":[{"annualMileage":10000,"residualPercent":57},{"annualMileage":12000,"residualPercent":56},{"annualMileage":15000,"residualPercent":54}]},
        //{"termMonths":42,"moneyFactor":0.00229166658,"apr":5.5,"residualPercent":55,"residuals":[{"annualMileage":10000,"residualPercent":55},{"annualMileage":12000,"residualPercent":54},{"annualMileage":15000,"residualPercent":52}]},
        //{"termMonths":48,"moneyFactor":0.00229166658,"apr":5.5,"residualPercent":53,"residuals":[{"annualMileage":10000,"residualPercent":53},{"annualMileage":12000,"residualPercent":52},{"annualMileage":15000,"residualPercent":49}]}
        //]

        //$hints = ['TRIM' => $deal->series, 'BODY_TYPE' => $deal->body, 'MODEL' => $deal->model, 'MODEL_CODE' => $deal->model_code];
        $results = $this->client->vehicle->findByVehicleAndPostalcode(request('vin'), request('zipcode'), [9], []);


        $results = $results->response[0];
        $data = [];
        $modelCodes = [];
        // gets residual data for best price
        /*foreach($results->programDealScenarios as $lease) {
            $residuals = $lease->programs[0]->residuals[1];
            $data['annualMileage'] = $residuals->miles;
            $data['residualPercent'] = $residuals->vehicles[1]->termValues[0]->percentage;
            foreach($residuals->vehicles as $vehicle) {
                $modelCodes[] = $vehicle->modelCode;
            }
        }*/
        // moneyfactor/miles data
        $totals = [];
        foreach($results->programDealScenarios as $lease) {
            $details[] = $lease->programs[0]->tiers[0]->leaseTerms;
            foreach($details as $i=>$tier) {
                $totals['moneyFactor'] = $tier[$i]->adjRate;
                /*$totals['residualPercentage'] = 66;
                $totals['residuals']['annualMileage'] = 10000;
                $totals['residuals']['residualPercent'] = 66;*/
            }
        }

        //return $totals;
        // terms/ percentage data
        foreach($results->programDealScenarios as $lease) {
            $residuals = $lease->programs[0]->residuals[1];
            //$data['residuals']['annualMileage'] = $residuals->miles;
            //$data['residuals']['residualPercent'] = $residuals->vehicles[1]->termValues[0]->percentage;
            $terms = $residuals->vehicles[1]->termValues;
            foreach($terms as $term) {
                $data['termMonths'] = $term->termLength;
                $data['moneyFactor'] = $totals['moneyFactor'];
                $data['apr'] = 5.93;
                $data['residualPercent'] = $term->percentage;
                $data['residuals']['annualMileage'] = $residuals->miles;
                $data['residuals']['residualPercent'] = $residuals->vehicles[1]->termValues[0]->percentage;
                //$data[] = $term;
            }
        }
        //$array = [];
        //$array[] = $data;
        //return $array;
        //return json_encode($residuals);
        /*{"termMonths":24,"moneyFactor":0.00247083325,"apr":5.93,"residualPercent":64,
            "residuals":[
                {"annualMileage":10000,"residualPercent":64},
                {"annualMileage":12000,"residualPercent":63},
                {"annualMileage":15000,"residualPercent":62}
            ]
        }*/


        /*$array = [

            'termMonths' => 36,
            'moneyFactor' => .00247,
            'apr' => 5.93,
            'residualPercent' => 60,
            [
            'residuals' => [
                'annualMileage' => 10000,
                'residualPercent' => 60,

                ]
            ]
        ];*/
        $a = array(
            'termMonths' => 36,
            'moneyFactor' => .00247,
            'apr' => 5.93,
            'residualPercent' => 60,
            'residuals' => array(
                'annualMileage' => 10000,
                'residualPercent' => 60,
            )
        );
        return json_encode($a);

        //return $results->response

    }

    /*public function getLeaseRates(JatoClient $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
            'zipcode' => 'required|string',
        ]);


        if (Cache::has($this->getCacheKey())) {
            $leases = Cache::get($this->getCacheKey());
        }
        else {
            try {
                $leases = $client->incentive->listPrograms(
                        request('jato_vehicle_id'),
                        [
                            'category' => 8,
                            'zipCode' =>  request('zipcode')
                        ]
                    )[0]->leaseRates ?? [];

                Cache::put($this->getCacheKey(), $leases, 1440);
            } catch (GuzzleException $e) {
                Cache::put($this->getCacheKey(), [], 5);
                $leases = [];
            }
        }
        print_r($leases);
        //return response()->json($leases);

    }

    private function getCacheKey()
    {
        return 'JATO_LEASES:' . request('jato_vehicle_id') . ':' . request('zipcode');
    }*/
}
