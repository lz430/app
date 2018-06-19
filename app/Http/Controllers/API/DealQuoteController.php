<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use DeliverMyRide\Cox\CoxClient;

class DealQuoteController extends BaseAPIController
{
    const CACHE_LENGTH = 1440;

    public $client;

    public function __construct(CoxClient $client)
    {
        $this->client = $client;
    }

    public function quote(Deal $deal)
    {
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
        ]);

        return response()->json(['asfasdf' => 'asdadf']);
    }

}
