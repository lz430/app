<?php

namespace App\Http\Controllers;

use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Mail\DealPurchasedUser;
use App\Purchase;
use Carbon\Carbon;
use DeliverMyRide\HubSpot\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;

class ApplyOrPurchaseController extends Controller
{
    /**
     * Create "Purchase" from deal and incentives
     */
    public function applyOrPurchase()
    {
        try {
            $this->validate(request(), [
                'deal_id' => 'required|exists:deals,id',
                'incentives' => 'required|array',
                'incentives.*.name' => 'required|string',
                'incentives.*.value' => 'required|numeric',
                'dmr_price' => 'required|numeric',
            ]);

            /**
             * dmr_price is the customer's "desired" price. i.e. after incentives etc have been applied.
             */
            $purchase = auth()->user()->purchases()->firstOrNew([
                'deal_id' => request('deal_id'),
                'dmr_price' => request('dmr_price'),
            ]);
            $purchase->incentives = json_encode(request('incentives'), JSON_NUMERIC_CHECK);
            $purchase->save();

            return view('apply-or-purchase')
                ->with('purchase', $purchase);
        } catch (ValidationException $e) {
            Log::notice('Invalid applyOrPurchase submission: ' . json_encode(request()->all()));

            return abort(500);
        }
    }

    public function purchase()
    {
        try {
            $this->validate(request(), [
                'purchase_id' => 'required|exists:purchases,id'
            ]);

            $purchase = Purchase::findOrFail(request('purchase_id'));

            $photo = ($purchase->deal->photos && $purchase->deal->photos->first())
                ? $purchase->deal->photos->first()
                : null;

            /**
             * Disallow changing completed_at
             */
            if ($purchase->completed_at) {
                return view('purchase')
                    ->with('purchase', $purchase)
                    ->with('photo', $photo);
            }

            /**
             * Mark purchase as "completed" from the perspective of this website
             */
            $purchase->completed_at = Carbon::now();
            $purchase->save();

            Mail::to(config('mail.dmr.address'))->send(new DealPurchasedDMR);
            Mail::to(auth()->user())->send(new DealPurchasedUser);
            
            $hubspotClient = new Client;
            $hubspotClient->updateContactByEmail(auth()->user()->email, [
            
            ]);

            return view('purchase')
                ->with('purchase', $purchase)
                ->with('photo', $photo);
        } catch (ValidationException | ModelNotFoundException $e) {
            return abort(404);
        }
    }

    public function viewApply()
    {
        try {
            $this->validate(request(), [
                'purchase_id' => 'required|exists:purchases,id',
            ]);

            $purchase = Purchase::with('deal')->findOrFail(request('purchase_id'));

            JavaScriptFacade::put([
                'purchase' => $purchase,
            ]);

            return view('view-apply')
                ->with('purchase', $purchase);
        } catch (ValidationException | ModelNotFoundException $e) {
            return abort(404);
        }
    }

    public function apply()
    {
        try {
            $this->validate(request(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'purchase_id' => 'required|exists:purchases,id',
            ]);

            $purchase = Purchase::findOrFail(request('purchase_id'));

            /**
             * Disallow changing completed_at
             */
            if ($purchase->completed_at) {
                return view('apply')
                    ->with('purchase', $purchase);
            }

            /**
             * Mark purchase as "completed" from the perspective of this website
             */
            $purchase->completed_at = Carbon::now();
            $purchase->save();

            Mail::to(config('mail.dmr.address'))->send(new ApplicationSubmittedDMR);
            Mail::to(request('email'))->send(new ApplicationSubmittedUser);

            return view('apply')
                ->with('purchase', $purchase);
        } catch (ValidationException | ModelNotFoundException $e) {
            return abort(404);
        }
    }
}
