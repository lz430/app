<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;

class DealFinancingController extends Controller
{
    private $deal;

    public function show(Deal $deal)
    {
        $this->deal = $deal;

        $data = [
            'deal' => $deal,
        ];

        return view('admin.deal-financing',
            $data
        );
    }
}
