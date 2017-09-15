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
}
