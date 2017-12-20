<?php

namespace App\Http\Controllers\API;

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

        // @TODO is this a vin or a vehicle id? What is actually going on here?

        $targets = Cache::remember($this->getCacheKey(), self::CACHE_LENGTH, function () use ($client) {
            return $client->targetsByVehicleIdAndZipcode(
                request('vin'),
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
}
