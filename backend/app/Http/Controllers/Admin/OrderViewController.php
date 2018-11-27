<?php

namespace App\Http\Controllers\Admin;

use App\Models\Order\Purchase;
use App\Http\Controllers\Controller;

class OrderViewController extends Controller
{
    private $purchase;

    public function show(Purchase $purchase)
    {
        $this->purchase = $purchase;

        $data = [
            'purchase' => $purchase,
        ];

        return view('admin.purchase-view',
            $data
        );
    }
}
