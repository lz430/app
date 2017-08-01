<?php

namespace App\Http\Controllers;

use App\Events\NewPurchaseInitiated;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Mail\DealPurchasedUser;
use App\Purchase;
use Carbon\Carbon;
use DeliverMyRide\HubSpot\Client;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;

class ApplyOrPurchaseController extends Controller
{
    /**
     * Create "Purchase" from deal and rebates
     */
    public function applyOrPurchase()
    {
        try {
            $this->validate(request(), [
                'type' => 'required|in:cash,finance,lease',
                'deal_id' => 'required|exists:deals,id',
                'dmr_price' => 'required|numeric',
                'msrp' => 'required|numeric',
                // Rebates.
                'rebates' => 'array',
                'rebates.*.rebate' => 'required_with:rebates|string',
                'rebates.*.value' => 'required_with:rebates|numeric',
                // Finance and lease values.
                'term' => 'required_if:type,finance,lease|integer',
                'down_payment' => 'required_if:type,finance,lease|integer',
                'amount_financed' => 'required_if:type,finance,lease|numeric'
            ]);

            /**
             * dmr_price is the customer's "desired" price. i.e. after rebates etc have been applied.
             */
            $purchase = auth()->user()->purchases()->firstOrNew([
                'deal_id' => request('deal_id'),
                'completed_at' => null,
            ]);

            $purchase->fill([
                'type' => request('type'),
                'rebates' => json_encode(request('rebates', []), JSON_NUMERIC_CHECK),
                'dmr_price' => request('dmr_price'),
                'msrp' => request('msrp'),
                'term' => request('term'),
                'down_payment' => request('down_payment'),
                'amount_financed' => request('amount_financed'),
            ]);

            $purchase->save();
    
            $purchase->load('deal.versions');

            event(new NewPurchaseInitiated($purchase));
    
            JavaScriptFacade::put([
                'purchase' => $purchase,
            ]);
    
            return view('view-apply')
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
                'purchase_id' => 'required|exists:purchases,id',
                'method' => 'string',
            ]);

            $purchase = Purchase::findOrFail(request('purchase_id'));

            /**
             * Disallow changing completed_at
             */
            if ($purchase->completed_at) {
                return redirect()->route('thank-you', ['method' => request('method')]);
            }

            /**
             * Mark purchase as "completed" from the perspective of this website
             */
            $purchase->completed_at = Carbon::now();
            $purchase->save();

            Mail::to(config('mail.dmr.address'))->send(new DealPurchasedDMR);
            Mail::to(auth()->user())->send(new DealPurchasedUser);
    
            try {
                (new Client)->updateContactByEmail(auth()->user()->email, [
                    'payment' => 'Cash',
                ]);
            } catch (Exception $exception) {
                Bugsnag::notifyException($exception);
            }
    
            return redirect()->route('thank-you', ['method' => request('method')]);
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
    
    public function thankYou()
    {
        if (! $lastPurchase = auth()->user()->purchases->last()) {
            return redirect()->route('home');
        }

        $photo = $lastPurchase->deal->featuredPhoto();
        
        return view('thank-you')->with(['purchase' => $lastPurchase, 'photo' => $photo]);
    }
}
