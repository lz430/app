<?php

namespace App\Http\Controllers\API;

use App\Models\Order\Purchase;
use App\Http\Controllers\Controller;

class ApplicationStatusController extends Controller
{
    public function checkCompleted()
    {
        $this->validate(request(), ['purchaseId' => 'required|exists:purchases,id']);

        $purchase = Purchase::findOrFail(request('purchaseId'));

        return $purchase->completed_at;
    }
}
