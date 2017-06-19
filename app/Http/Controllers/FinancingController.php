<?php

namespace App\Http\Controllers;

use App\VersionDeal;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;

class FinancingController extends Controller
{
    public function show($id)
    {
        $deal = VersionDeal::with('photos')->findOrFail($id);

        JavaScriptFacade::put([
            'deal' => $deal,
        ]);

        return view('financing');
    }
}
