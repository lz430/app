<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use DeliverMyRide\HubSpot\HubspotClient;
use SevenShores\Hubspot\Exceptions\BadRequest;
use App\Notifications\NotifyToSlackChannel;
use Illuminate\Support\Facades\Notification;

class BrochureController extends BaseAPIController
{
    /**
     * @param Request $request
     * @param HubspotClient $client
     * @throws \Illuminate\Validation\ValidationException
     */
    public function contact(Request $request, HubspotClient $client)
    {
        $this->validate(
            $request,
            [
                'form' => 'required|string',
                'g_recaptcha_response' => 'required|string',

                // All forms
                'firstname' => 'required|string',
                'lastname' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
                'message' => 'required|string',

                // Brochure site contact
                'city' => 'required_if:form,brochure|string',
                'state' => 'required_if:form,brochure|string',

                // deal detail
                'deal_id' => 'required_if:form,deal|string',
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
                'content' => $request->message,
                'source_type' => 'FORM',
                'created_by' => $contact['vid'],
                'hs_pipeline' => '0',
                'hs_pipeline_stage' => '1',
            ];

            if ($request->form === 'brochure') {
                $ticketData['subject'] = 'Brochure Site Contact Form';
            } else {
                $ticketData['subject'] = 'Question Regarding Deal #'.$request->deal_id;
            }

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

            $data = [
                'title' => 'New HubSpot Ticket',
                'message' => $ticketData['subject'],
                'fields' => [
                    'Environment' => config('app.env'),
                    'First Name' => $request->firstname,
                    'Last Name' => $request->lastname,
                    'Ticket' => $client->getUrlForTicket($ticket),
                    'Contact' => $client->getUrlForContact($contact),
                ],
            ];

            Notification::route('slack', config('services.slack.webhook'))
                ->notify(new NotifyToSlackChannel($data));
        }

        return response()->json(['status' => 'ok']);
    }
}
