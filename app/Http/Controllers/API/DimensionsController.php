<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\GuzzleException;


class DimensionsController extends BaseAPIController
{
    public function getDimensions(JatoClient $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
        ]);

        try {
            $data = $client->feature->get(request('jato_vehicle_id'), 2, 1, 100)->results;
        } catch (GuzzleException $e) {
            $data = [];
        }

        return $data;
    }
}
