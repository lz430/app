<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Http\Controllers\Controller;

class DealDebuggerController extends Controller
{
    public function show(Deal $deal)
    {
        return view('admin.deal-debugger')
            ->with('deal', $deal);
    }

    public function vinLookup()
    {
        $deal = Deal::where('vin', request('vin'))->first();

        if ($deal) {
            return redirect('/admin/deal-debugger/' . $deal->id);
        }

        return 'Cannot find this VIN.';
    }
}
