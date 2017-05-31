<?php

namespace App\Http\Controllers;

use App\VersionDeal;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class ApplyOrPurchaseController extends Controller
{
    public function applyOrPurchase()
    {
        try {
            $this->validate(request(), [
                'deal_id' => 'required|exists:version_deals,id'
            ]);

            $deal = VersionDeal::findOrFail(request('deal_id'));

            return view('apply-or-purchase')
                ->with('deal', $deal);
        } catch (ModelNotFoundException | ValidationException $e) {
            return abort(404);
        }
    }

    public function purchase()
    {
        $this->validate(request(), [
            'deal_id' => 'required|exists:version_deals,id'
        ]);

        return view('purchase');
    }

    public function viewApply()
    {
        $this->validate(request(), [
            'deal_id' => 'required|exists:version_deals,id',
        ]);

        return view('view-apply')
            ->with('deal_id', request('deal_id'));
    }

    public function apply()
    {
        $this->validate(request(), [
            'deal_id' => 'required|exists:version_deals,id',
        ]);
        // TODO: add validations

        // TODO: send email to user (receipt) and dmr

        return view('apply');
    }
}
