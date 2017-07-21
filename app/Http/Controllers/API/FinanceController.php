<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use DeliverMyRide\MarketScan\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;

class FinanceController extends Controller
{
    use ValidatesRequests;

    public function getTerms(Client $client)
    {
        $this->validate(request(), [
            'vin' => 'required|string',
            'zipcode' => 'required|string',
            'down_payment' => 'required|numeric',
            'msrp' => 'required|numeric',
            'price' => 'required|numeric',
        ]);

        $terms = $client->getFinanceTerms(
            request('vin'),
            request('zipcode'),
            request('down_payment'),
            request('msrp'),
            request('price')
        );

        return response()->json($terms);
    }
}
