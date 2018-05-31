<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use DeliverMyRide\Cox\CoxClient;
use Cache;
use GuzzleHttp\Exception\GuzzleException;
use App\Transformers\BestPriceTransformer;

class DealBestOfferController extends BaseAPIController
{
    const CACHE_LENGTH = 1440;

    public $client;

    public function __construct(CoxClient $client)
    {
        $this->client = $client;
    }

    /*public function __construct(JatoClient $client)
    {
        $this->client = $client;
    }*/

    public function getBestOffer(Deal $deal)
    {
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
        ]);

        // We want to show the cash best offer information even in the finance tabs
        $paymentType = request('payment_type');

        switch($paymentType) {
            case 'cash':
            case 'finance':
                $type = 2;
                break;
            case 'lease':
                $type = 9;
                break;
        }

        $hints = ['TRIM' => $deal->series, 'BODY_TYPE' => $deal->body, 'MODEL' => $deal->model, 'MODEL_CODE' => $deal->model_code];
        $results = $this->client->vehicle->findByVehicleAndPostalcode($deal->vin, request('zipcode'), [$type], $hints);
        return (new BestPriceTransformer)->transform(['results' => $results, 'paymentType' => $paymentType, 'model_code' => $deal->model_code]);
    }

    /*public function getBestOffer(Deal $deal)
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

        if (Cache::tags(['best-offers'])->has($cacheKey)) {
            $data = Cache::tags(['best-offers'])->get($cacheKey);
        } else {
            try {
                $data = $this->client->incentive->bestOffer($jatoVehicleId, $paymentType, $zipCode, $sortedTargets);
                Cache::tags(['best-offers'])->put($cacheKey, $data, self::CACHE_LENGTH);

            } catch (GuzzleException $e) {
                Cache::tags(['best-offers'])->put($cacheKey, new \stdClass(), 5);
                $data = new \stdClass();
            }
        }

        if (!isset($data->totalValue)) {
            $data->totalValue = 0;
            $data->programs = [];
        }

        return response()->json($data);
    }*/

}
