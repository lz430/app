<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\JATO\JatoClient;

use GuzzleHttp\Exception\GuzzleException;


class WarrantiesController extends BaseAPIController
{
    public function getWarranties(JatoClient $client)
    {
        $this->validate(request(), [
            'jato_vehicle_id' => 'required|exists:versions,jato_vehicle_id',
        ]);

        try {
            $data = $client->feature->get(request('jato_vehicle_id'), 14, 0, 100)->results;
        } catch (GuzzleException $e) {
            $data = [];
        }

        return $data;
    }
}
