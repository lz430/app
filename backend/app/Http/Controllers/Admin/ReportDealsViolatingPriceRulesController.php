<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Support\Facades\DB;

use App\Models\Deal;
//use App\Models\Dealer;
use App\Http\Controllers\Controller;

class ReportDealsViolatingPriceRulesController extends Controller
{
    public function index()
    {
        $data = [];

        $percentage = config('dmr.pricing_validation_percentage');
        $deals = DB::table('deals')->whereRaw('format((((deals.msrp-deals.price)/deals.msrp * 100)),0) > '.$percentage. ' ORDER BY deals.dealer_id asc')->get();
        // Loop through the return and prep for output
        foreach ($deals as $deal) {
            // build the priceingArray to call function validateDealPriceRules used in Deal.php to populate ES
            $pricingArray = (object) [
                'msrp' => $deal->msrp,
                'default' => $deal->price,
            ];
            $validationResult = $this->useDealValidation($pricingArray);

//            $dealerData = DB::table('dealers')->whereRaw('dealer_id = "'.$deal->dealer_id.'" ')->get();
//            dd($dealerData);

            $item[$deal->dealer_id]['dealer'] = [
                'id' => $deal->dealer_id,
                'dealer_name' => $deal->dealer_name,
            ];
            $item[$deal->dealer_id]['deals'][] = [
                'deal' => $deal,
                'reason' => $validationResult['reason'],
            ];
        }

        $data = $item;

        return view('admin.reports.deals-violating-price-rules', ['deals' => $data]);
    }
    /*
     *  internal function to reach out to the Deal.php controller.
     *  Call and Return results from validateDealPriceRules()
     */
    public function useDealValidation($pricingArray) {
        $newDeal = new Deal();
        return $newDeal->validateDealPriceRules($pricingArray);
    }
}
