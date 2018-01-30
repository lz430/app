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

    // Targets that should not selected
    const TARGET_BLACKLIST = [
        49 // Direct/Private Offer Recipient
    ];

    // Targets that are automatically applied to all customers
    const TARGET_OPEN_OFFERS = [
        25, // Open Offer
        36, // Finance & Lease Customer
        39, // Finance Customer
        26, // Lease Customer
        45, // Captive Finance Customer
        52 // Auto Show Cash Recipient
    ];

    public function getTargets(Client $client)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
        ]);

        $targets = Cache::remember($this->getCacheKey(), self::CACHE_LENGTH, function () use ($client) {
            $response = $client->targetsByVehicleIdAndZipcode(
                $this->vehicleIdByVin(request('vin')),
                request('zipcode')
            );

            return collect($response)->reject(function ($target) {
                return in_array($target['targetId'], self::TARGET_BLACKLIST);
            })->values()->all();
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
