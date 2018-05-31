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

    public function getResiduals($results, $tLength, $modelCode)
    {
        $residuals = [];

        $programs = $results->programDealScenarios;
        foreach($programs as $i => $program) {
            $data = $program->programs[$i]->residuals;
            foreach($data as $d) {
                $terms = [];
                foreach($d->vehicles as $vehicle){
                    if($vehicle->modelCode === $modelCode) {
                        foreach($vehicle->termValues as $length) {
                            if($length->termLength === $tLength){
                                $terms = $length->percentage;
                            }

                        }
                    }
                }
                $residuals[] = array('annualMileage' => $d->miles, 'residualPercent' => $terms);
            }
        }
        return array_values(array_sort($residuals));
    }

    public function getInitialResidualPercent($results, $tLength, $modelCode)
    {
        $initialPercent = $this->getResiduals($results, $tLength, $modelCode);
        return ($initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    public function getTiers($results, $modelCode)
    {
        $testing = [];
        $tiersData = $results->programDealScenarios;
        foreach($tiersData as $i => $program) {
            $tiers = $program->programs[$i]->tiers;
            foreach($tiers as $t) {
                if($t->name === 'A+') {
                    foreach($t->leaseTerms as $term){
                        $apr = $term->adjRate * 2400;
                        $testing[] = array('termMonths' => $term->length, 'moneyFactor' => $term->adjRate, 'apr' => $apr, 'residualPercent' => $this->getInitialResidualPercent($results, $term->length, $modelCode), 'residuals' => $this->getResiduals($results, $term->length, $modelCode));
                    }
                }
            }
        }
        return $testing;
    }

    public function getLeaseRates()
    {
        $this->validate(request(), [
            'vin' => 'required|string',
            'modelcode' => 'required|string',
            'zipcode' => 'required|string',
        ]);

        $results = $this->client->vehicle->findByVehicleAndPostalcode(request('vin'), request('zipcode'), [9], [])->response;
        //$collection = collect($results);
        //return $collection;
        $leaseRates = collect($results)->first();
        $retrieveLeaseRates = $this->getTiers($leaseRates, request('modelcode'));
        return json_encode($retrieveLeaseRates);

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
