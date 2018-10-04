<?php

namespace App\Http\Controllers\API;

use App\Events\UserWantsNotificationWhenInRange;
use App\Http\Controllers\Controller;
use DeliverMyRide\HubSpot\HubspotClient;
use Illuminate\Http\Request;

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

        $client->forms()->submit('3388780', '1d44d5dc-d865-447e-9a56-3f11388c21f8', ['email' => $request->email])
        return response('ok');
    }
}
