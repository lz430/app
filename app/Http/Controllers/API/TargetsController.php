<?php

namespace App\Http\Controllers\API;

use App\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Cache;

use GuzzleHttp\Exception\GuzzleException;


class TargetsController extends Controller
{
    use ValidatesRequests;

    // Targets that should not selected
    const TARGET_BLACKLIST = [
        2, // Affinity Customer
        7, // Dealer
        14, // Other
        32, // Sales Manager
        33, // Sales Person
        43, // Certificate/Coupon Bearer ** Coupon **
        47, // Disaster Victim
        49, // Direct/Private Offer Recipient ** Coupon **
        54 // Vin Specific Customer
    ];

    // Targets that are automatically applied to all customers
    // Need to duplicate these in configureStore.js initialState
    const TARGET_OPEN_OFFERS = [
        25, // Open Offer
        36, // Finance & Lease Customer
        39, // Finance Customer
        26, // Lease Customer
        45, // Captive Finance Customer
        52 // Auto Show Cash Recipient
    ];

    public function getTargets(JatoClient $client)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
        ]);

        if (Cache::has($this->getCacheKey())) {
            $targets = Cache::get($this->getCacheKey());
        }
        else {
            try {
                $response = $client->incentive->listTargets(
                    $this->vehicleIdByVin(request('vin')),
                    ['zipCode' => request('zipcode')]
                );

                $targets = collect($response)->reject(function ($target) {
                    return in_array($target->targetId,
                        array_merge(
                            self::TARGET_BLACKLIST,
                            self::TARGET_OPEN_OFFERS
                        )
                    );
                })->values()->all();

                Cache::put($this->getCacheKey(), $targets, 1440);
            } catch (GuzzleException $e) {
                Cache::put($this->getCacheKey(), [], 5);
                $targets = [];
            }
        }

        return response()->json([
            'targets' => $targets
        ]);
    }

    /**
     * @return string
     */
    private function getCacheKey() : string
    {
        return 'JATO_TARGETS:' . request('vin') . ':' . request('zipcode');
    }

    /**
     * Return jato vehicle id from vin.
     * @param $vin
     * @return string
     */
    private function vehicleIdByVin($vin) : string
    {
        $version = Deal::where('vin', $vin)->with('version')->firstOrFail()->version;

        return $version->jato_vehicle_id;
    }
}
