<?php

namespace DeliverMyRide\JATO;

use App\Deal;
use Facades\App\JATO\RebateMatches;

class IncentiveImporter
{
    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function getCacheKey($zipcode, $vin, $ids)
    {
        return 'getRebates'
            . ':' . $zipcode
            . ':' . $vin
            . ':' . implode($ids);
    }

    public function availableRebates($vin, $zipcode, $ids)
    {
        $version = Deal::where('vin', $vin)->with('versions')->firstOrFail()->versions()->firstOrFail();
        $vehicleId = $version->jato_vehicle_id;

        $incentives = ! is_null($ids)
            ? collect($this->client->incentivesByVehicleIdAndZipcodeWithSelected(
                $vehicleId,
                $zipcode,
                $ids
            ))
            : collect($this->client->incentivesByVehicleIdAndZipcode($vehicleId, $zipcode));

        return $incentives->map(function ($incentive) {
            return [
                'id' => $incentive['subProgramId'],
                'rebate' => $incentive['restrictions'],
                'value' => $incentive['cash'],
                'statusName' => $incentive['statusName'],
                'openOffer' => $incentive['targetName'] === 'Open Offer',
                'types' => $this->getTypes($incentive),
            ];
        })->reject(function ($incentive) {
            return empty($incentive['types']);
        })->filter(function ($incentive) {
            return $this->validIncentive($incentive);
        })->values();
    }

    protected function getTypes($incentive)
    {
        $types = [];

        if (RebateMatches::cash($incentive)) {
            $types[] = 'cash';
        }

        if (RebateMatches::finance($incentive)) {
            $types[] = 'finance';
        }

        if (RebateMatches::lease($incentive)) {
            $types[] = 'lease';
        }

        return $types;
    }

    public function validIncentive($incentive)
    {
        if ($incentive['value'] == 0) {
            return false;
        }

        if (str_contains($incentive['rebate'], 'Truecar')) {
            return false;
        }

        return true;
    }
}
