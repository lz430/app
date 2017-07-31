<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use DeliverMyRide\MarketScan\Client;
use Illuminate\Foundation\Validation\ValidatesRequests;

class LeaseController extends Controller
{
    use ValidatesRequests;

    public function getTerms(Client $client)
    {
        $this->validate(request(), [
            'vin' => 'required|string',
            'zipcode' => 'required|string',
            'annual_mileage' => 'required|numeric|min:5000|max:80000',
            'down_payment' => 'required|numeric',
            'msrp' => 'required|numeric',
            'price' => 'required|numeric',
        ]);

        $terms = $client->getLeaseTerms(
            request('vin'),
            request('zipcode'),
            request('annual_mileage'),
            request('down_payment'),
            request('msrp'),
            request('price')
        );

        return response()->json($terms);
    }
}
