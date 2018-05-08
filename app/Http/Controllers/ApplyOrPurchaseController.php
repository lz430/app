<?php

namespace App\Http\Controllers;

use App\Events\NewPurchaseInitiated;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Purchase;
use App\Transformers\PurchaseTransformer;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laracasts\Utilities\JavaScript\JavaScriptFacade;

class ApplyOrPurchaseController extends Controller
{
    /**
     * Create "Purchase" from deal and rebates
     */
    public function applyOrInitiatePurchase(Request $request)
    {
        try {
            $this->validate($request, [
                'type' => 'required|in:cash,finance,lease',
                'deal_id' => 'required|exists:deals,id',
                'dmr_price' => 'required|numeric',
                'msrp' => 'required|numeric',
                // Rebates.
                'rebates' => 'array',
                'rebates.*.title' => 'required_with:rebates|string',
                'rebates.*.value' => 'required_with:rebates|numeric',
                // Finance and lease values.
                'term' => 'required_if:type,finance,lease|integer',
                'down_payment' => 'required_if:type,finance,lease|numeric',
                'monthly_payment' => 'required_if:type,finance,lease|numeric',
                'amount_financed' => 'required_if:type,finance|numeric',
            ]);

            /**
             * We don't want to save the purchase to the DB until we collect the user's email and query the user, so store
             * in session for now
             */
            $purchase = new Purchase([
                'deal_id' => request('deal_id'),
                'completed_at' => null,
                'type' => request('type'),
                'rebates' => request('rebates', []),
                'dmr_price' => request('dmr_price'),
                'msrp' => request('msrp'),
                'term' => request('term') ?: 60,
                'down_payment' => request('down_payment') ?: 0,
                'monthly_payment' => request('monthly_payment') ?: 0,
                'amount_financed' => request('amount_financed') ?: 0,
            ]);
            session(['purchase' => $purchase]);

            /**
             * If email saved to session, put in request and send to receiveEmail.
             */
            if (session()->has('email')) {
                $request->merge(['email' => session()->get('email')]);
            }

            return redirect('/request-email?payment=' . request('type'));
        } catch (ValidationException $e) {
            Log::notice('Invalid applyOrPurchase submission: ' . json_encode(['request' => request()->all(), 'errors' => $e->errors()]));

            return abort(500);
        }
    }

    public function requestEmail(Request $request)
    {
        return view('request-email')->with('email', $request->session()->get('email'));
    }

    public function receiveEmail(Request $request)
    {
        $this->validate(
            $request,
            [
                'email' => 'required|email',
                'drivers_license_state' => 'required|string', // This is out of alphabetical order but is required to exist for the driversLicense validator
                'drivers_license_number' => 'required|drivers_license_number',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'phone_number' => 'required|digits:10',
                'g-recaptcha-response' => 'required|recaptcha',
            ],
            [
                'drivers_license_number' => 'Please provide a valid License Number.',
                'g-recaptcha-response' => 'The recaptcha is required.',
            ]
        );


        //
        // User
        $user = DB::transaction(function () use ($request) {
            /**
             * If we already have a user with this email, let's use that account
             * instead of the newly created one.
             */
            $user = User::updateOrCreate(
                [
                    'email' => $request->email
                ],
                [
                    'drivers_license_number' => $request->drivers_license_number,
                    'drivers_license_state' => $request->drivers_license_state,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'phone_number' => $request->phone_number,
                    'zip' => session()->get('zip'),
                ]
            );

            auth()->login($user);

            return $user;
        });


        //
        // If we don't have a purchase stored in session give up
        if (! session()->has('purchase') || ! is_object(session('purchase'))) {
            return redirect()->back();
        }

        //
        // Retrieve and store purchase
        $purchase = session('purchase');
        $purchase->user_id = $user->id;

        $existing_purchase = Purchase::where('user_id', $user->id)
            ->where('deal_id', $purchase->deal_id)
            ->whereNull('completed_at')
            ->first();

        if ($existing_purchase) {
            $purchase = $existing_purchase;
        }

        $purchase->save();

        event(new NewPurchaseInitiated($user, $purchase));

        if (request('method') == 'cash') {
            return redirect()->route('thank-you', ['method' => 'cash']);
        }
        
        return redirect()->route('view-apply', ['purchaseId' => $purchase->id])
            ->with('purchase', $purchase);
    }

    public function purchase()
    {
        try {
            $this->validate(request(), [
                'purchase_id' => 'required|exists:purchases,id',
                'method' => 'string',
            ]);

            $purchase = Purchase::findOrFail(request('purchase_id'));

            return $this->handlePurchase($purchase);
        } catch (ValidationException | ModelNotFoundException $e) {
            return abort(500);
        }
    }

    private function handlePurchase(Purchase $purchase)
    {
        /**
         * Disallow changing completed_at
         */
        if ($purchase->completed_at) {
            return redirect()->route('thank-you', ['method' => $purchase->type]);
        }

        /**
         * Mark purchase as "completed" from the perspective of this website
         */
        $purchase->completed_at = Carbon::now();
        $purchase->save();

        Mail::to(config('mail.dmr.address'))->send(new DealPurchasedDMR);

        return redirect()->route('thank-you', ['method' => $purchase->type]);
    }

    public function viewApply($purchaseId)
    {
        try {
            $purchase = Purchase::with('deal', 'deal.dealer', 'buyer')->findOrFail($purchaseId);

            JavaScriptFacade::put([
                'featuredPhoto' => $purchase->deal->featuredPhoto(),
                'purchase' => $purchase,
                'user' => $purchase->buyer,
            ]);

            return view('view-apply');
        } catch (ModelNotFoundException $e) {
            return abort(500);
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
        if (! auth()->user() || ! $lastPurchase = auth()->user()->purchases->last()) {
            return redirect(route('home'));
        }

        $lastPurchase->load('deal.photos');
        $lastPurchase = fractal()->item($lastPurchase)->transformWith(PurchaseTransformer::class)->toJson();
        $deal = auth()->user()->purchases->last()->deal;
        $vautoFeatures = collect(
            array_values(
                array_diff(
                    explode('|', $deal->vauto_features),
                    $deal->jatoFeatures->map(function ($feature) {
                        return $feature->feature;
                    })->toArray()
                )
            )
        );

        return view('thank-you')->with('purchase', $lastPurchase)->with('deal', $deal)->with('features', $vautoFeatures);
    }
}
