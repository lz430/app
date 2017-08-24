<?php

namespace App\Http\Controllers\API;

use App\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;

class RebatesController extends Controller
{
    use ValidatesRequests;

    public function getRebates(Client $Client)
    {
        $this->validate(request(), [
            'category' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
            'vin' => 'required|string',
            'selected_rebate_ids' => 'array:int',
        ]);

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
                ]);
            })->map(function ($incentive) {
                return [
                    'id' => $incentive['subProgramId'],
                    'rebate' => $incentive['title'],
                    'value' => $incentive['cash'],
                    'statusName' => $incentive['statusName'],
                    'types' => [
                        'Auto Show Cash' => ['cash', 'finance'],
                        'Bonus Cash' => ['cash', 'finance'],
                        'Cash Back' => ['cash', 'finance'],
                        'Credit Card Rebate' => ['cash', 'finance'],
                        'Cash on MSRP ' => ['cash', 'finance'],
                        'Cash on Term APR' => ['finance'],
                    ][$incentive['typeName']] ?? [],
                ];
            })->values();

        return response()->json([
            'rebates' => $availableRebates,
        ]);
    }

    public function getBestRebateIds(Client $Client)
    {
        $this->validate(request(), [
            'category' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
            'vin' => 'required|string',
        ]);

        $vin = request('vin');
        $zipcode = request('zipcode');

        $version = Deal::where('vin', $vin)->with('versions')->firstOrFail()->versions->first();
        $vehicleId = $version->jato_vehicle_id;

        $incentives = /**
         * @return \Illuminate\Support\Collection
         */
        (function () use ($Client, $vehicleId, $zipcode) {
            switch (request('category')) {
                case 'cash':
                    return $Client->bestCashIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode);
                case 'finance':
                    return $Client->bestFinanceIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode);
                case 'lease':
                    return $Client->bestLeaseIncentivesByVehicleIdAndZipcode($vehicleId, $zipcode);
                default:
                    return [];
            }
        })();

        $bestRebateIds = collect($incentives)
            ->map(function ($incentive) {
                return $incentive['subPrgId'];
            })->values();

        return response()->json([
            'ids' => $bestRebateIds,
        ]);
    }
}
