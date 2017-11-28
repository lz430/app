<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ZipCodesController extends Controller
{
    //
    public function show($code)
    {
        return response()->json([
        //'code' => $code,
        'supported' => true
        ]);
    }

}
