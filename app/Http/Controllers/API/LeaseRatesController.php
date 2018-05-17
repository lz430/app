<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\JatoClient;

use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;


class LeaseRatesController extends BaseAPIController
{

    public function getLeaseRates(JatoClient $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
            'zipcode' => 'required|string',
        ]);


        if (Cache::has($this->getCacheKey())) {
            $leases = Cache::get($this->getCacheKey());
        }
        else {
            try {
                $leases = $client->incentive->listPrograms(
                        request('jato_vehicle_id'),
                        [
                            'category' => 8,
                            'zipCode' =>  request('zipcode')
                        ]
                    )[0]->leaseRates ?? [];

                Cache::put($this->getCacheKey(), $leases, 1440);
            } catch (GuzzleException $e) {
                Cache::put($this->getCacheKey(), [], 5);
                $leases = [];
            }
        }

        return response()->json($leases);

    }

    private function getCacheKey()
    {
        return 'JATO_LEASES:' . request('jato_vehicle_id') . ':' . request('zipcode');
    }
}
