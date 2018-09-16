<?php

namespace App\Http\Controllers\API;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use App\Transformers\PurchaseTransformer;
use Illuminate\Http\Request;

use App\Models\Purchase;
use App\Models\Deal;
use App\Models\User;

use App\Events\NewPurchaseInitiated;
use Illuminate\Support\Facades\DB;

/**
 * Checkout is 4 steps
 *  1) Start (user clicks "Buy now" on deal detail page)
 *  2) Submit Contact Information (user clicks "Submit" on deal confirm page
 *  3) Submit Financing Information (Optional) (user completes route one??)
 *  4) Complete (??)
 */
class CheckoutController extends BaseAPIController
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['start', 'contact']]);
    }

    /**
     * Starting the checkout process basically claims the deal.
     *
     * We gather the information about the deal
     * and store in an a session object, once the checkout process is completed
     * we'll store it as a real purchase and go from there.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function start(Request $request)
    {
        $this->validate($request, [
            'deal_id' => 'required|exists:deals,id',
            'strategy' => 'required|in:cash,finance,lease',
            'quote' => 'required',

            // Not an awesome name.
            'amounts' => 'required',
        ]);

        $deal = Deal::where('id', $request->get('deal_id'))->first();
        $amounts = $request->get('amounts');

        // TODO validate amounts
        /*
         * We don't want to save the purchase to the DB until we collect
         * the user's email and query the user, so store in session for now
         */
        $purchase = new Purchase([
            'deal_id' => $deal->id,
            'completed_at' => null,
            'type' => $request->get('strategy'),
            'rebates' => $request->get('quote')['rebates'],
            'dmr_price' => $request->get('amounts')['price'],
            'msrp' => $deal->prices()->msrp,
            'term' => isset($amounts['term']) ? $amounts['term'] : 0,
            'down_payment' => isset($amounts['down_payment']) ? $amounts['down_payment'] : 0,
            'monthly_payment' => isset($amounts['monthly_payment']) ? $amounts['monthly_payment'] : 0,
            'amount_financed' => isset($amounts['financed_amount']) ? $amounts['financed_amount'] : 0,
            'lease_mileage' => isset($amounts['leased_annual_mileage']) ? $amounts['leased_annual_mileage'] : null,
        ]);

        // Updates purchased deal status to pending
        Deal::where('id', $deal->id)->update(['status' => 'pending']);

        $request->session()->put('purchase', $purchase);

        /*
         * If email saved to session, put in request and send to receiveEmail.
         */
        if (session()->has('email')) {
            $request->merge(['email' => session()->get('email')]);
        }

        return response()->json(['status' => 'okay', 'purchase' => $purchase->toArray()]);
    }

    /**
     * We submit contact information of the user and create a purchase / user.
     * @param Request $request
     * @return bool|\Illuminate\Http\JsonResponse
     * @throws \Throwable
     */
    public function contact(Request $request)
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
        // This is not very secure.
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
            //auth()->login($user);

            return $user;
        });

        //
        // If we don't have a purchase stored in session give up
        // TODO: Return an actual error message / http response.
        if (!session()->has('purchase') || !is_object(session('purchase'))) {
            return response()->json(['error' => 'invalid session']);
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
        $token = auth('api')->login($user);
        $return = [
            'purchase' => (new PurchaseTransformer())->transform($purchase),
            'token' => $this->buildTokenResponse($token),
        ];

        if ($purchase->isCash()) {
            $return['destination'] = '/thank-you?method=cash';
        } else {
            $return['destination'] = "/apply/{$purchase->id}";
        }

        return response()->json($return);
    }

    /**
     * @param Purchase $purchase
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFinancing(Purchase $purchase) {
        try {
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
                'url' => $url,
            ];
            return response()->json($data);

        } catch (ModelNotFoundException $e) {
            return abort(404);
        }
    }

    /**
     * Get the token array structure.
     * @param $token
     * @return array
     */
    protected function buildTokenResponse($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ];
    }

}
