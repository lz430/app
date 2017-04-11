<?php

use App\JATO\Make;
use Illuminate\Support\Facades\Route;

Route::get('/', function (\DeliverMyRide\JATO\Client $client) {
    return view('welcome')
        ->with('makes', Make::select('id', 'name')->with(['models' => function ($query) {
            $query->select('id', 'name', 'make_id');
        }])->get());
});
