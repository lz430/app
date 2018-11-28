<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\GuzzleException;

class DealDimensionsController extends BaseAPIController
{
    public function getDimensions(Deal $deal, JatoClient $client)
    {
        try {
            $data = $client->feature->get($deal->version->jato_vehicle_id, 2, 1, 100)->results;
        } catch (GuzzleException $e) {
            $data = [];
        }

        return $data;
    }
}
