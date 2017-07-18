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
        ]);

        $vin = request('vin');
        $zipcode = request('zipcode');

        $vehicleId = $client->getVehicleIDByVIN($vin);

        $availableRebates = $client->getRebates(
            $zipcode,
            $vin,
            $vehicleId
        );

        $compatibilities = $client->getCompatibilities($vehicleId, $zipcode, $availableRebates);

        return response()->json([
            'rebates' => $availableRebates,
            'compatibilities' => $compatibilities,
        ]);
    }
}
