<?php

namespace App\Http\Controllers;

use App\Zipcode;
use App\Http\Controllers\Controller;

class ZipCodesController extends Controller
{
    public function show($code)
    {
        session(['zip' => $code]);

        return response()->json([
            'code' => $code,
            'supported' => ZipCode::isSupported($code),
        ]);
    }
}
