<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Mail\DealPurchasedUser;
use Illuminate\Support\Facades\Mail;
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

            Mail::to(config('mail.dmr.address'))->send(new DealPurchasedDMR);
            Mail::to(auth()->user())->send(new DealPurchasedUser);

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

            Mail::to(config('mail.dmr.address'))->send(new ApplicationSubmittedDMR);
            Mail::to(auth()->user())->send(new ApplicationSubmittedUser);

            return view('apply');
        } catch (ValidationException $e) {
            return abort(404);
        }
    }
}
