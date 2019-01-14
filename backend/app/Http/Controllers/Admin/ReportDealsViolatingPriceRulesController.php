<?php

namespace App\Http\Controllers\Admin;
use App\Models\Deal;
use App\Http\Controllers\Controller;


class ReportDealsViolatingPriceRulesController extends Controller
{
    public function index()
    {
        $data = [];

        $deals = Deal::where('status', '=', 'available')
            ->whereNotNull('price')
            ->orderBy('dealer_id', 'ASC')->get();

        // Loop through the return and prep for output
        foreach ($deals as $deal) {

            // build the priceingArray to call function validateDealPriceRules used in Deal.php to populate ES
            $pricingArray = (object) [
                'msrp' => $deal->msrp,
                'default' => $deal->price,
            ];
            // Validate the $pricingArray
            $validationResult = $this->useDealValidation($pricingArray);

            if($validationResult['value'] == 'false') {
                $item[$deal->dealer_id]['dealer'] = [
                    'id' => $deal->dealer_id,
                    'dealer_name' => $deal->dealer_name,
                ];
                $item[$deal->dealer_id]['deals'][] = [
                    'deal' => $deal,
                    'reason' => $validationResult['reason'],
                ];
                $data = $item;
            }
        }

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
