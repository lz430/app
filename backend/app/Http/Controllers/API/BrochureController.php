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
                //'g-recaptcha-response' => 'required|recaptcha',
            ],
            [
                'g-recaptcha-response' => 'The recaptcha is required.',
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
