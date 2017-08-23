<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use DeliverMyRide\Formulas;
use DeliverMyRide\JATO\Client;
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

        $terms = collect([12, 24, 36, 48, 60, 72])->map(function ($term) {
            return [
                'term' => $term,
                'rate' => Formulas::INTEREST_RATE * .01,
                'payment' => Formulas::calculateFinancedMonthlyPayments(
                    request('price'),
                    request('down_payment'),
                    $term
                ),
                'amount_financed' => request('price') - request('down_payment'),
            ];
        })->values();

        return response()->json($terms);
    }
}
