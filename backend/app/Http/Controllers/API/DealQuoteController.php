<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;

class DealQuoteController extends BaseAPIController
{

    public function quote(Deal $deal)
    {
        $this->validate(request(), [
            'payment_type' => 'required|string|in:cash,finance,lease',
            'zipcode' => 'required|string',
            'roles' => 'required|array|in:default,employee,supplier,college,military,conquest,loyal,responder,gmcompetitive,gmlease,cadillaclease,cadillacloyalty,gmloyalty',
            'down' => 'integer',
            'trade_value' => 'integer',
            'trade_owed' => 'integer',
        ]);
        $dealQuoter = resolve('App\Services\Quote\DealQuote');
        return $dealQuoter->get(
                $deal,
                request('zipcode'),
                request('payment_type'),
                request('roles'),
                request('force', false),
                request('down', 0),
                request('trade_value', 0),
                request('trade_owed', 0)
            );
    }

}
