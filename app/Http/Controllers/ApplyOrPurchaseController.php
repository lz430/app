<?php

namespace App\Http\Controllers;

use Illuminate\Validation\ValidationException;

class ApplyOrPurchaseController extends Controller
{
    public function applyOrPurchase()
    {
        try {
            $this->validate(request(), [
                'deal_id' => 'required|exists:version_deals,id'
            ]);

            return view('apply-or-purchase')
                ->with('deal_id', request('deal_id'));
        } catch (ValidationException $e) {
            return abort(404);
        }
    }

    public function purchase()
    {
        try {
            $this->validate(request(), [
                'deal_id' => 'required|exists:version_deals,id'
            ]);

            return view('purchase');
        } catch (ValidationException $e) {
            return abort(404);
        }
    }

    public function viewApply()
    {
        try {
            $this->validate(request(), [
                'deal_id' => 'required|exists:version_deals,id',
            ]);

            return view('view-apply')
                ->with('deal_id', request('deal_id'));
        } catch (ValidationException $e) {
            return abort(404);
        }
    }

    public function apply()
    {
        try {
            $this->validate(request(), [
                'deal_id' => 'required|exists:version_deals,id',
            ]);

            // TODO: send email to user (receipt) and dmr

            return view('apply');
        } catch (ValidationException $e) {
            return abort(404);
        }
    }
}
