<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Http\Controllers\Controller;

class DealFeatureDebuggerController extends Controller
{
    public function show(Deal $deal)
    {
        // @todo don't just pull the deal duh
        return view('admin.deal-feature-debugger')
            ->with('deal', $deal);
    }
}
