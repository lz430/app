<?php

namespace App\Http\Controllers;

use App\Deal;

class CompareController extends Controller
{
    public function index()
    {
        $this->validate(request(), [
           'deals' => 'required|array|exists:version_deals,id',
        ]);
        
        $deals = Deal::whereIn('id', request('deals'))->with('photos', 'version.taxesAndDiscounts')->get();
        
        $withoutDeal = function ($dealId) {
            return route('compare', ['deals' => array_diff(request('deals'), [$dealId])]);
        };
        
        return view('compare')->with('deals', $deals)->with('withoutDeal', $withoutDeal);
    }
}
