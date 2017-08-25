<?php

namespace App\Http\Controllers;

use App\Events\NewPurchaseInitiated;
use App\Events\NewUserRegistered;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Mail\DealPurchasedUser;
use App\Purchase;
use App\User;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
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
             * Create a new user and log them in
             */
            $user = User::create();
            auth()->login($user);

            /**
             * dmr_price is the customer's "desired" price. i.e. after rebates etc have been applied.
             */
            $purchase = $user->purchases()->firstOrNew([
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

            /**
             * Get the users email
             */
            return redirect('request-email');
        } catch (ValidationException $e) {
            Log::notice('Invalid applyOrPurchase submission: ' . json_encode(request()->all()));

            return abort(500);
        }
    }

    public function requestEmail()
    {
        $purchase = auth()->user()->purchases()->latest()->firstOrFail();

        return view('request-email')
            ->with('purchase', $purchase);
    }

    public function receiveEmail()
    {
        $this->validate(request(), [
            'email' => 'required|email',
        ], [
            'email' => 'Email is required',
        ]);

        /** @var User $user */
        $user = auth()->user();

        $user->email = request('email');
        $user->save();

        $purchase = $user->purchases()->with('deal')->latest()->firstOrFail();

        event(new NewUserRegistered($user));
        event(new NewPurchaseInitiated($purchase));

        return (function () use ($purchase) {
            switch ($purchase->type) {
                case Purchase::CASH:
                case Purchase::LEASE:
                    return $this->handlePurchase($purchase);
                case Purchase::FINANCE:
                    JavaScriptFacade::put([
                        'purchase' => $purchase,
                    ]);

                    return view('view-apply')
                        ->with('purchase', $purchase);
                default:
                    return abort('500');
            }
        })();
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
                'payment' => title_case($purchase->type),
            ]);
        } catch (Exception $exception) {
            Bugsnag::notifyException($exception);
        }

        return redirect()->route('thank-you', ['method' => request('method')]);
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

        auth()->logout();
        
        return view('thank-you')->with(['purchase' => $lastPurchase, 'photo' => $photo]);
    }
}
