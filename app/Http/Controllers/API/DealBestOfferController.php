<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Deal;
use DeliverMyRide\JATO\Client;
use Cache;

class DealBestOfferController extends BaseAPIController
{
    const CACHE_LENGTH = 1440;

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

        // We want to show the cash best offer information even in the finance tabs
        $paymentType = request('payment_type');
        if ($paymentType == 'finance') {
            $paymentType = 'cash';
        }

        // Generate the best offer cache key
        $sortedTargets = collect(request('targets'))->sort()->implode(',');
        $jatoVehicleId = $deal->version->jato_vehicle_id;
        $zipCode = request('zipcode');
        $cacheKey = "best-offer:{$jatoVehicleId}:{$paymentType}:{$zipCode}:{$sortedTargets}";

        return Cache::tags(['best-offers'])->remember($cacheKey, self::CACHE_LENGTH, function () use ($jatoVehicleId, $paymentType, $zipCode, $sortedTargets) {
            return $this->client->bestOffer($jatoVehicleId, $paymentType, $zipCode, $sortedTargets);
        });
    }
}
