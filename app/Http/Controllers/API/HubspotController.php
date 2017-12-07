<?php

namespace App\Http\Controllers\API;

use App\Events\UserWantsNotificationWhenInRange;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HubspotController extends Controller
{
    public function notInServiceArea(Request $request)
    {
        event(UserWantsNotificationWhenInRange::class, $request->email);

        return response('ok');
    }
}
