<?php

namespace App\Http\Controllers;

use App\Deal;

class CompareController extends Controller
{
    public function index()
    {
        $this->validate(request(), [
           'deals' => 'required|array|exists:deals,id',
        ]);

        $deals = Deal::whereIn('id', request('deals'))->with(
            'photos',
            'versions.incentives'
        )->get();
        
        return view('compare')->with('deals', $deals);
    }
}
