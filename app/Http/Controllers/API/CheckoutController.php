<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;


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

        // TODO validate amounts against known backend values in order validate client side
        // computed values


        return response()->json(['OKAY']);
    }
}
