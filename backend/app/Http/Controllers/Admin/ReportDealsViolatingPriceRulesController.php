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
                'msrp' => $deal->prices()->msrp,
                'default' => $deal->prices()->default,
            ];
            // Validate the $pricingArray
            $validationResult = $this->useDealValidation($pricingArray);

            if ($validationResult['isPricingValid'] == false) {
                $item[$deal->dealer->id]['dealer'] = [
                    'id' => $deal->dealer->id,
                    'dealer_name' => $deal->dealer->name,
                ];
                $item[$deal->dealer->id]['deals'][] = [
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
    public function useDealValidation($pricingArray)
    {
        $newDeal = new Deal();
        return $newDeal->validateDealPriceRules($pricingArray);
    }
}
