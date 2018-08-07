<?php

namespace App\Http\Controllers;

use App\Events\NewPurchaseInitiated;
use App\Mail\ApplicationSubmittedDMR;
use App\Mail\ApplicationSubmittedUser;
use App\Mail\DealPurchasedDMR;
use App\Models\Purchase;
use App\Transformers\DealTransformer;
use App\Transformers\PurchaseTransformer;
use App\Models\User;
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

        //Mail::to(config('mail.dmr.address'))->send(new DealPurchasedDMR);

        return redirect()->route('thank-you', ['method' => $purchase->type]);
    }

    public function viewApply($purchaseId)
    {
        try {
            $purchase = Purchase::with('deal', 'deal.dealer', 'buyer')->findOrFail($purchaseId);
            $deal = $purchase->deal;
            $dealer = $deal->dealer;
            $user = $purchase->buyer;
            $pricing = $deal->prices();
            $photo = $deal->featuredPhoto();
            $query = [
                'rteOneDmsId' => config('services.routeone.id'),
                'dealerId' => $dealer->route_one_id,
                'buyOrLease' => ($purchase->type === "finance" ? 1 : 2),
                'email' => $user->email,
                'vehicle_vin' => $deal->vin,
                'vehicleYear' => $deal->year,
                'vehicleMake' => $deal->version->model->make->name,
                'vehicleModel' => $deal->version->model->name,
                'contractTerms_vehiclestyle' => $deal->version->style(),
                'contractTerms_msrp' => $pricing->msrp,
                'contractTerms_cash_down' => $purchase->down_payment,
                'contractTerms_financed_amount' =>  $purchase->amount_financed,
                'contractTerms_term' => $purchase->term,
                'vehicle_image_url' => ($photo ? $photo->url : ''),
                'dealership_name' => $deal->dealer->name,
            ];

            if (config('services.routeone.test_mode')) {
               $query['dealerId'] = 'CJ7IW';
                $url = config('services.routeone.test_url');
            } else {
                $url = config('services.routeone.production_url');
            }

            $url = $url . '?' . http_build_query($query);

            $data = [
                'featuredPhoto' => $purchase->deal->featuredPhoto(),
                'purchase' => $purchase,
                'user' => $purchase->buyer,
                'url' => $url,
            ];


            return view('checkout-financing', $data);
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

            //Mail::to(config('mail.dmr.address'))->send(new ApplicationSubmittedDMR);
            //Mail::to(request('email'))->send(new ApplicationSubmittedUser);

            return view('checkout-financing-complete')
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
        $dealData = json_encode((new DealTransformer())->transform($deal));

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
        return view('checkout-complete')->with('purchase', $lastPurchase)->with('deal', $dealData)->with('features', $vautoFeatures);
    }
}
