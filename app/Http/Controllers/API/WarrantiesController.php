<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\Client;

class WarrantiesController extends BaseAPIController
{
    public function getWarranties(Client $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
        ]);

        return $client->featuresByVehicleIdAndCategoryId(request('jato_vehicle_id'), 14)['results'];
    }
}
