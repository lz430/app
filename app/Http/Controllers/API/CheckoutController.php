<?php

namespace App\Http\Controllers\API;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Transformers\PurchaseTransformer;
use Illuminate\Http\Request;

use App\Models\Order\Purchase;
use App\Models\Deal;
use App\Models\User;
use Carbon\Carbon;

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
        $this
        ->middleware(['auth:api', 'can:update,purchase'], ['except' => ['start', 'contact']]);

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

        $purchase = new Purchase([
            'status' => 'cart',
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

        $purchase->save();
        $jwt = resolve('Tymon\JWTAuth\JWT');
        $token = $jwt->fromSubject($purchase);

        return response()->json(
            [
                'status' => 'okay',
                'orderToken' => $token,
                'purchase' => (new PurchaseTransformer())->transform($purchase),
            ]);
    }

    /**
     * We submit contact information of the user and create a purchase / user.
     * @param Request $request
     * @return bool|\Illuminate\Http\JsonResponse
     * @throws \Throwable
     */
    public function contact(Request $request, Purchase $purchase)
    {
        $this->validate(
            $request,
            [
                'order_token' => 'required|string',
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
        $this->authorize('update', [$purchase, $request->order_token]);

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
            return $user;
        });
        $purchase->user_id = $user->id;
        $purchase->status = "contact";
        $purchase->save();

        $token = auth('api')->login($user);
        $return = [
            'purchase' => (new PurchaseTransformer())->transform($purchase),
            'userToken' => $this->buildTokenResponse($token),
        ];

        if ($purchase->isCash()) {
            $return['destination'] = '/checkout/complete?method=cash';
        } else {
            $return['destination'] = "/checkout/financing";
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
     * @param Purchase $purchase
     * @return \Illuminate\Http\JsonResponse
     */
    public function financingComplete(Purchase $purchase) {
        /**
         * Disallow changing completed_at
         */
        if (!$purchase->completed_at) {
            $purchase->completed_at = Carbon::now();
            $purchase->save();
        }
        return response()->json(['status' => 'okay']);
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
