<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Purchase;

class ApplicationStatusController extends Controller
{
    public function checkCompleted()
    {
        $this->validate(request(), ['purchaseId' => 'required|exists:purchases,id']);
        
        $purchase = Purchase::findOrFail(request('purchaseId'));
        
        return $purchase->completed_at;
    }
}
