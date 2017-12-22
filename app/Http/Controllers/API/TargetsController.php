<?php

namespace App\Http\Controllers\API;

use App\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Cache;

class TargetsController extends Controller
{
    use ValidatesRequests;
    const CACHE_LENGTH = 1440;

    public function getTargets(Client $client)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
        ]);

        $targets = Cache::remember($this->getCacheKey(), self::CACHE_LENGTH, function () use ($client) {
            return $client->targetsByVehicleIdAndZipcode(
                $this->vehicleIdByVin(request('vin')),
                request('zipcode')
            );
        });

        return response()->json([
            'targets' => $targets
        ]);
    }

    private function getCacheKey()
    {
        return 'JATO_TARGETS:' . request('vin') . ':' . request('zipcode');
    }

    private function vehicleIdByVin($vin)
    {
        $version = Deal::where('vin', $vin)->with('versions')->firstOrFail()->versions()->firstOrFail();
        return $version->jato_vehicle_id;
    }
}
