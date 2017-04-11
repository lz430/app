<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function (\DeliverMyRide\JATO\Client $client) {
    return view('welcome')
        ->with('makes', \App\JATO\Make::pluck('name', 'id'))
        ->with('models', \App\JATO\VehicleModel::pluck('name', 'id'));
});

Route::post('/start', function (\DeliverMyRide\JATO\Client $client) {
    $versions = \App\JATO\Version::where('model_id', request()->get('model'))->limit(10)->get();

    dd($versions);

    return view('welcome');
});
