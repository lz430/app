<?php

namespace DeliverMyRide\JATO;

use App\Deal;
use Facades\App\JATO\RebateMatches;

class TargetImporter
{
    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function getCacheKey($zipcode, $vin, $ids)
    {
        return 'getTarget'
            . ':' . $zipcode
            . ':' . $vin
            . ':' . implode($ids);
    }

    public function targets($vin, $zipcode)
    {
        return ['HEY I AM A TARGET'];
    }

    // @todo update to get $ based on targets or something?
    public function availableTargets($vin, $zipcode, $ids)
    {
        return [];

        $version = Deal::where('vin', $vin)->with('versions')->firstOrFail()->versions()->firstOrFail();
        $vehicleId = $version->jato_vehicle_id;

        $targets = ! is_null($ids)
            ? collect($this->client->incentivesByVehicleIdAndZipcodeWithSelected(
                $vehicleId,
                $zipcode,
                $ids
            ))
            : collect($this->client->incentivesByVehicleIdAndZipcode($vehicleId, $zipcode));

        return $targets->map(function ($incentive) {
            return [
                'id' => $incentive['subProgramId'],
                'rebate' => $incentive['restrictions'],
                'value' => $incentive['cash'],
                'statusName' => $incentive['statusName'],
                'openOffer' => $incentive['targetName'] === 'Open Offer',
                // 'types' => $this->getTypes($incentive),
            ];
        })->reject(function ($incentive) {
            return empty($incentive['types']);
        })->filter(function ($incentive) {
            return $this->validIncentive($incentive);
        })->values();
    }
}
