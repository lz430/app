<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\Client;

class DimensionsController extends BaseAPIController
{
    public function getDimensions(Client $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
        ]);

        return $client->featuresByVehicleIdAndCategoryId(request('jato_vehicle_id'), 2)['results'];
    }
}
