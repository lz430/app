<?php

namespace App\Http\Controllers\API;
use App\Models\Deal;
use DeliverMyRide\DataDelivery\Manager\DealRatesAndRebatesManager;
use DeliverMyRide\DataDelivery\DataDeliveryClient;

class DealLeaseRatesController extends BaseAPIController
{

    public $client;

    public function __construct(DataDeliveryClient $client)
    {
        $this->client = $client;
    }
    public function getRatesForTerms($data)
    {
        $data = $data;
        $terms = $data->leaseTerms;
        $months = [];
        foreach($terms as $term){
            $months[] = array('termMonths' => $term->QualifyingTermEnd, 'moneyFactor' => isset($term->Factor) ? $term->Factor : $term->Rate / 2400, 'apr' => isset($term->Rate) ? $term->Rate : $term->Factor * 2400, 'residualPercent' => $this->getInitialResidualPercent($data, $term->QualifyingTermEnd), 'residuals' => $this->getResiduals($data, $term->QualifyingTermEnd));
        }
        return $months;
    }

    public function getResiduals($data, $timeFrame)
    {
        $results = $data;
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

    public function getCashRebates($data)
    {
        $data = $data;
        $cashRebates = $data->cashRebates;
        return $cashRebates->totalValue;
    }

    public function getInitialResidualPercent($data, $timeFrame)
    {
        $initialPercent = $this->getResiduals($data, $timeFrame);
        return ($initialPercent[0]['residualPercent']) ? $initialPercent[0]['residualPercent'] : null;
    }

    public function getLeaseRates(Deal $deal)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
        ]);

        $params = [
            'zipcode' => request('zipcode'),
        ];

        $manager = new DealRatesAndRebatesManager($deal, $params['zipcode'], $this->client);
        $manager->setFinanceStrategy('lease');
        $manager->setConsumerRole('default');
        $manager->searchForVehicleAndPrograms();
        $manager->setScenario();

        $data = $manager->getData();
        $leaseRates = $this->getRatesForTerms($data);
        return response()->json($leaseRates);

    }
}
