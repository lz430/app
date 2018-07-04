<?php

namespace App\Http\Controllers\API;

use App\Models\Purchase;
use App\Models\Deal;

use Illuminate\Http\Request;


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

        $deal = Deal::where('id', $request->get('deal_id'))->get()->first();
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
            'down_payment' => isset($amounts['financed_down_payment']) ? $amounts['financed_down_payment'] : 0,
            'monthly_payment' => isset($amounts['monthly_payment']) ? $amounts['monthly_payment'] : 0,
            'amount_financed' => isset($amounts['financed_amount']) ? $amounts['financed_amount'] : 0,
        ]);

        $request->session()->put('purchase', $purchase);

        /*
         * If email saved to session, put in request and send to receiveEmail.
         */
        if (session()->has('email')) {
            $request->merge(['email' => session()->get('email')]);
        }

        return response()->json(['status' => 'okay']);
    }
}
