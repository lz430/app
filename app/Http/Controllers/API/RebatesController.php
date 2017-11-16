<?php

namespace App\Http\Controllers\API;

use App\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RebatesController extends Controller
{
    use ValidatesRequests;

    public function getRebates(Client $Client)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
            'selected_rebate_ids' => 'array:int',
        ]);

        $cacheKey = __FUNCTION__
            . ':' . request('zipcode')
            . ':' . request('vin')
            . ':' . implode(request('selected_rebate_ids', []));

        return Cache::remember($cacheKey, 1440, function () use ($Client) {
            $vin = request('vin');
            $zipcode = request('zipcode');

            $version = Deal::where('vin', $vin)->with('versions')->firstOrFail()->versions->first();
            $vehicleId = $version->jato_vehicle_id;

            $incentives = request()->has('selected_rebate_ids')
                ? collect($Client->incentivesByVehicleIdAndZipcodeWithSelected(
                    $vehicleId,
                    $zipcode,
                    request('selected_rebate_ids')
                ))
                : collect($Client->incentivesByVehicleIdAndZipcode($vehicleId, $zipcode));

            $availableRebates = $incentives
                ->filter(function ($incentive) {
                    return in_array($incentive['categoryName'], [
                        "Retail Cash Programs",
                        "Other Retail Programs",
                    ]);
                })->map(function ($incentive) {
                    return [
                        'id' => $incentive['subProgramId'],
                        'rebate' => $incentive['restrictions'],
                        'value' => $incentive['cash'],
                        'statusName' => $incentive['statusName'],
                        'openOffer' => $incentive['targetName'] === 'Open Offer',
                        'types' => $this->getTypes($incentive),
                    ];
                })->filter(function ($incentive) {
                    return ! empty($incentive['types']);
                })->values();

            return response()->json([
                'rebates' => $availableRebates,
            ]);
        });
    }

    protected function getTypes($incentive)
    {
        $types = [];

        if ($this->matchesCash($incentive)) {
            $types[] = 'cash';
        }

        if ($this->matchesFinance($incentive)) {
            $types[] = 'incentive';
        }

        if ($this->matchesLease($incentive)) {
            $types[] = 'lease';
        }

        return $types;
    }

    protected function matchesCash($incentive)
    {
        // @todo return whether it matches the right targets and type's per Beth's forthcoming document
        return true;
    }

    protected function matchesFinance($incentive)
    {
        // @todo return whether it matches the right targets and type's per Beth's forthcoming document
        return true;
    }

    protected function matchesLease($incentive)
    {
        // @todo return whether it matches the right targets and type's per Beth's forthcoming document
        return true;
    }
}
