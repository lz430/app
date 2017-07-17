<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use DeliverMyRide\MarketScan\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;

class RebatesController extends Controller
{
    use ValidatesRequests;

    public function getRebates(Client $client)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
            'selected_rebate_ids' => 'sometimes|required|array',
        ]);

        $vin = request('vin');
        $zipcode = request('zipcode');
        $vehicleId = $client->getVehicleIDByVIN(request('vin'));

        $compatibleRebatesList = $client->getRebates(
            $zipcode,
            $vin,
            $vehicleId
        );

        $selectedRebates = array_map(function ($selectedRebateId) use ($compatibleRebatesList) {
            return array_first($compatibleRebatesList, function ($compatibleRebate) use ($selectedRebateId) {
                return $selectedRebateId == $compatibleRebate['id'];
            });
        }, request('selected_rebate_ids', []));

        [$selectedRebates, $compatibleRebates] = $client->getCompatibleRebates(
            $vehicleId,
            $zipcode,
            $compatibleRebatesList,
            $selectedRebates
        );

        return response()->json([
            'selected_rebates' => $selectedRebates,
            'compatible_rebates' => $compatibleRebates,
        ]);
    }
}
