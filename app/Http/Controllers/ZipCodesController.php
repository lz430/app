<?php

namespace App\Http\Controllers;

class ZipCodesController extends Controller
{
    public function store()
    {
        session(['zip' => request('code')]);

        return response(['status' => 'ok']);
    }
}
