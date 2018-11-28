<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use DeliverMyRide\HubSpot\HubspotClient;
use SevenShores\Hubspot\Exceptions\BadRequest;

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

        if (hubspot_enabled()) {
            $contactData = [
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'phone' => $request->phone,
            ];

            $contact = $client->contacts()->createOrUpdate($request->email, $client->mungePayloadData($contactData));
            $contact = $contact->toArray();

            $ticketData = [
                'subject' => 'Brochure Site Contact Form',
                'content' => $request->message,
                'source_type' => 'FORM',
                'created_by' => $contact['vid'],
                'hs_pipeline' => '0',
                'hs_pipeline_stage' => '1',
            ];

            try {
                $ticket = $client->tickets()->create($client->mungePayloadData($ticketData, 'name'));
                $ticket = $ticket->toArray();
            } catch (BadRequest $exception) {
                return abort(400);
            }

            try {
                $client->crmAssociations()->create([
                    'fromObjectId' => $ticket['objectId'],
                    'toObjectId' => $contact['vid'],
                    'category' => 'HUBSPOT_DEFINED',
                    'definitionId' => 16,
                ]);
            } catch (BadRequest $exception) {
                return abort(400);
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
