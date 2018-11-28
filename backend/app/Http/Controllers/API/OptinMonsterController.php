<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Events\UserDataChanged;

class OptinMonsterController extends BaseAPIController
{
    public function setEmailSession(Request $request)
    {
        if ($request->has('email')) {
            $request->session()->put('email', request('email'));
            event(new UserDataChanged([
                'email' => request('email'),
                'from' => 'optin',
            ]));

            return response(['status' => 'ok'], Response::HTTP_OK);
        }

        return response(['status' => 'invalid'], Response::HTTP_BAD_REQUEST);
    }
}
