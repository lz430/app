<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\JatoClient;

class DimensionsController extends BaseAPIController
{
    public function getDimensions(JatoClient $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
        ]);

        return $client->feature->get(request('jato_vehicle_id'), 2, 1, 100)->results;
    }
}
