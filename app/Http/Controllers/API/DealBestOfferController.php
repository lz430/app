<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Deal;
use DeliverMyRide\JATO\Client;

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

        return $this->client->bestOffer($deal->versions->first()->jato_vehicle_id, request('payment_type'), request('zipcode'), implode(',', request('targets')));
    }
}
