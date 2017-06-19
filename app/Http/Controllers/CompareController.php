<?php

namespace App\Http\Controllers;

use App\VersionDeal;

class CompareController extends Controller
{
    public function index()
    {
        $this->validate(request(), [
           'deals' => 'required|array|exists:version_deals,id',
        ]);
        
        $deals = VersionDeal::whereIn('id', request('deals'))->with('photos', 'version.taxesAndDiscounts')->get();
    
        return view('compare')->with('deals', $deals);
    }
}
