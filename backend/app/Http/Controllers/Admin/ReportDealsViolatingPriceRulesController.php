<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;

class ReportDealsViolatingPriceRulesController extends Controller
{
    public function index()
    {
        $data = [];

        $deals = Deal::with('dealer')->where('status', '=', 'available')
            ->whereNotNull('price')
            ->orderBy('dealer_id', 'ASC')->get();

        // Loop through the return and prep for output
        foreach ($deals as $deal) {
            $prices = $deal->prices();
            $validationResult = $deal->validateDealPriceRules($prices);

            if (! $validationResult['isPricingValid']) {
                $item[$deal->dealer->id]['dealer'] = [
                    'id' => $deal->dealer->id,
                    'dealer_name' => $deal->dealer->name,
                ];
                $item[$deal->dealer->id]['deals'][] = [
                    'deal' => $deal,
                    'prices' => $prices,
                    'reason' => $validationResult['reason'],
                ];
                $data = $item;
            }
        }

        return view('admin.reports.deals-violating-price-rules', ['deals' => $data]);
    }
}
