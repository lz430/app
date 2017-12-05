<?php

namespace App\Http\Controllers;

use App\Listeners\CreateHubspotContact;
use App\Listeners\UpdateHubspotContact;
use DeliverMyRide\HubSpot\Client;
use Illuminate\Http\Request;

class HubspotController extends Controller
{
    protected $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }
    
    public function updateContact(Request $request)
    {
        if (! $request->session()->has('hubspot_id')) {
            event(CreateHubspotContact::class, $request);
        } elseif ($hubspot_id = $request->session()->get('hubspot_id')) {
            event(UpdateHubspotContact::class, $request->json());
        }

        return response('ok');
    }

    public function notInServiceArea($email)
    {
        $this->client->request(
            'POST',
            'https://forms.hubspot.com/uploads/form/v2/3388780/1d44d5dc-d865-447e-9a56-3f11388c21f8',
            [
                'form-params' => [
                    'body' => $email,
                    'pageName' => 'Not In Service Area',
                ],

                'headers' => [
                    'content-type' => 'application/x-www-form-urlencoded'
                ]
            ]
        );

        return back()->with('status', 'Email saved! Thank you!');
    }
}
