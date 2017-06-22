<?php

namespace App\Http\Controllers;

use App\Deal;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;

class FinancingController extends Controller
{
    public function show($id)
    {
        $deal = Deal::with('photos')->findOrFail($id);

        JavaScriptFacade::put([
            'deal' => $deal,
        ]);

        return view('financing');
    }

    public function showThankYou()
    {
        return view('thankyou');
    }
}
