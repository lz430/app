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

        /**
         * Formula: EMI = ( P × r × (1+r)n ) / ((1+r)n − 1)
         * EMI = Equated Monthly Installment
         * P = Loan Amount - Down payment
         * r = Annual Interest rate / 1200
         * n = Term (Period or no.of year or months for loan repayment.)
         */

        $EMI = ((10000 - 1000) * (.04 / 1200) * ((1 + (.04 / 1200))^12)) / (((1+(.04 / 1200))^12) - 1);

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
