<?php

namespace App\Http\Controllers;

class BuyRequestController extends Controller
{
    public function store()
    {
        dd(request()->all());
    }
}
