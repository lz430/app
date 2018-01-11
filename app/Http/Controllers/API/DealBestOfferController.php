<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Deal;
use DeliverMyRide\JATO\Client;
use Cache;

class DealBestOfferController extends BaseAPIController
{
    public $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function getBestOffer(Deal $deal)
    {
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
            'targets' => 'required|array',
        ]);

        $targets = request('targets');
        sort($targets, SORT_NUMERIC);
        $sortedTargets = implode(',', $targets);
        $jatoVehicleId = $deal->versions->first()->jato_vehicle_id;
        $paymentType = request('payment_type');
        $zipCode = request('zipcode');

        $cacheKey = "best-offer:$jatoVehicleId:$paymentType:$zipCode:$sortedTargets";

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $response = $this->client->bestOffer($jatoVehicleId, $paymentType, $zipCode, implode(',', $targets));

        Cache::tags(['best-offers'])->put($cacheKey, $response, 1440);

        return $response;
    }
}
