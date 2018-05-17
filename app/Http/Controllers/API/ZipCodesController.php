<?php

namespace App\Http\Controllers\API;

use App\Models\Zipcode;
use App\Http\Controllers\Controller;

class ZipCodesController extends Controller
{
    public function show($code)
    {
        return response()->json([
            'code' => $code,
            'supported' => ZipCode::isSupported($code),
        ]);
    }
}
