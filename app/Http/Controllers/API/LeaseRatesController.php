<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\Client;

class LeaseRatesController extends BaseAPIController
{
    public function getLeaseRates(Client $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
            'zipcode' => 'required|string',
        ]);

        return $client->incentivesByVehicleIdAndZipcode(
            request('jato_vehicle_id'),
            request('zipcode'),
            ['category' => 8]
        )[0]['leaseRates'] ?? [];
    }
}
