<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DeliverMyRide\HubSpot\HubspotClient;

class HubspotController extends Controller
{
    public function notInServiceArea(Request $request, HubspotClient $client)
    {
        $this->validate(
            $request,
            [
                'email' => 'required|email',
            ]
        );

        if (hubspot_enabled()) {
            $client->forms()->submit('3388780', '1d44d5dc-d865-447e-9a56-3f11388c21f8', ['email' => $request->email]);
        }

        return response('ok');
    }
}
