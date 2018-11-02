<?php

namespace App\Http\Controllers\API;
use DeliverMyRide\HubSpot\HubspotClient;
use Illuminate\Http\Request;

class BrochureController extends BaseAPIController
{

    /**
     * @param Request $request
     * @param HubspotClient $client
     * @return \Illuminate\Http\JsonResponse
     */
    public function contact(Request $request, HubspotClient $client)
    {
        $this->validate(
            $request,
            [
                'firstname' => 'required|string',
                'lastname' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'city' => 'required|string',
                'state' => 'required|string',
                'message' => 'required|string',
                'g_recaptcha_response' => 'required|recaptcha',
            ],
            [
                'g_recaptcha_response' => 'This token is invalid, please try again',
            ]
        );

        $portalId = '3388780';
        $formId = '7234fff9-27e5-41af-9548-3011d45ecbec';
        if (hubspot_enabled()) {
            $client->forms()->submit($portalId, $formId,
                [
                    'firstname' => $request->firstname,
                    'lastname' => $request->lastname,
                    'email' => $request->email,
                    'city' => $request->city,
                    'state' => $request->state,
                    'message' => $request->message,
                ]
            );
        }

        return response()->json(['status' => 'ok']);
    }

}
