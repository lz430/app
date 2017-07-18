<?php

namespace App\Http\Controllers;

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
        if (! auth()->check() && ! $request->session()->has('hubspot_id')) {
            $response = $this->client->createContact($request->all());
            session(['hubspot_id' => $response['vid']]);
            return $response;
        }
        
        if ($hubspot_id = $request->session()->get('hubspot_id')) {
            return $this->client->updateContactByHubspotId($hubspot_id, $request->all());
        }
        
        if (auth()->user()->email) {
            return $this->client->updateContactByEmail(auth()->user()->email, $request->all());
        }
    }
}
