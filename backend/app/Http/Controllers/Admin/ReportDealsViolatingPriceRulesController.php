<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
//use App\Models\Dealer;
use App\Http\Controllers\Controller;

class ReportDealsViolatingPriceRulesController extends Controller
{
    public function index()
    {
    //        SELECT
    //        id,
    //        dealer_id,
    //        vin,
    //        msrp,
    //        price
    //        from deals
    //        where
    //        format((((msrp-price)/msrp*100)),0) > 25
    //        -- (((msrp-price)/msrp*100)) >25
        $deals = Deal::where('status', '=', 'available')->first();

        //$deals = Deal::where('status', '=', 'available')->first();
//        $deals = Deal::where('price_validation->value', '=', 'false')->first();
        //dd($deals->prices());

        //var_dump($deals);exit;
        dd($deals);

        //dd($deals->source_price->msrp);

        //return view('admin.reports.deals-violating-price-rules', ['data' => $deals]);
        return view('admin.reports.deals-violating-price-rules', ['deal' => $deals]);
    }
}
