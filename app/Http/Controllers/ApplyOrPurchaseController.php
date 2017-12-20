<?php

namespace App\Http\Controllers;

use App\Events\NewPurchaseInitiated;
use App\Events\UserDataChanged;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Purchase;
use App\Transformers\PurchaseTransformer;
use App\User;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Carbon\Carbon;
use DeliverMyRide\HubSpot\Client;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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
    public function applyOrPurchase(Request $request)
    {
        try {
            $this->validate($request, [
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
                'down_payment' => 'required_if:type,finance|integer',
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
                'rebates' => json_encode(request('rebates', []), JSON_NUMERIC_CHECK),
                'dmr_price' => request('dmr_price'),
                'msrp' => request('msrp'),
                'term' => request('term') ?: 60,
                'down_payment' => request('down_payment') ?: 0,
                'amount_financed' => request('amount_financed') ?: 0,
            ]);

            session(['purchase' => $purchase]);

            /**
             * If email saved to session, put in request and send to receiveEmail.
             */
            if (session()->has('email')) {
                $request->merge(['email' => session()->get('email')]);
            }

            return redirect('request-email');
        } catch (ValidationException $e) {
            Log::notice('Invalid applyOrPurchase submission: ' . json_encode(request()->all()));

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
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'phone_number' => 'required|digits:10',
                'g-recaptcha-response' => 'required|recaptcha',
            ],
            [
                'g-recaptcha-response' => 'The recaptcha is required.',
            ]
        );

        $user = DB::transaction(function () use ($request) {
            /**
             * If we already have a user with this email, let's use that account
             * instead of the newly created one.
             */
            $user = User::updateOrCreate([
                    'email' => $request->email
                ],
                [
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'phone_number' => $request->phone_number,
                    'zip' => session()->get('zip'),
                ]);

            auth()->login($user);

            return $user;
        });

        if (! session()->has('purchase') || ! is_object(session('purchase'))) {
            return redirect()->back();
        }

        $purchaseData = session('purchase');
        $purchaseData->user_id = $user->id;
        $purchase = Purchase::where('user_id', $user->id)
            ->where('deal_id', $purchaseData->deal_id)
            ->whereNull('completed_at')
            ->first();

        if (! $purchase) {
            unset($purchaseData['deal']);
            $purchase = Purchase::create($purchaseData->toArray());
        }

        event(new NewPurchaseInitiated($user, $purchase));

        return redirect()->route('view-apply')
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

    public function viewApply()
    {
        $purchase = session('purchase');
        JavaScriptFacade::put([
            'featuredPhoto' => $purchase->deal->featuredPhoto(),
            'purchase' => $purchase,
            'user' => $purchase->buyer,
        ]);

        return view('view-apply');
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

        return view('thank-you')->with('purchase', $lastPurchase);
    }
}
