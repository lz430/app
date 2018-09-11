<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;

use GuzzleHttp\Exception\GuzzleException;


class DealWarrantiesController extends BaseAPIController
{
    public function getWarranties(Deal $deal, JatoClient $client)
    {

        try {
            $data = $client->feature->get($deal->version->jato_vehicle_id, 14, 1, 100)->results;
        } catch (GuzzleException $e) {
            $data = [];
        }

        return $data;
    }
}
