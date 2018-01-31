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
}
