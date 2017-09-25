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

        return $client->programsByVehicleIdAndCategoryIdAndZipCode(
            request('jato_vehicle_id'),
            8,
            request('zipcode')
        )[0]['leaseRates'] ?? [];
    }
}
