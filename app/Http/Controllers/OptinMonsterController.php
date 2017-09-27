<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OptinMonsterController extends Controller
{
    public function setEmailSession(Request $request)
    {
        if ($request->has('email')) {
            $request->session()->put('email', request('email'));
        }
        
        return response(['status' => 'ok'], Response::HTTP_OK);
    }
}
