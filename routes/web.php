<?php

use Illuminate\Support\Facades\Route;

Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');

Route::get('', 'WelcomeController@index');

Route::post('saved-vehicle', 'SavedVehicleController@store')
    ->name('savedVehicle.store');

Route::group(['middleware' => 'auth'], function () {
    Route::get('buy-request/create', 'BuyRequestController@create')->name('buyRequest.create');
    Route::post('buy-request', 'BuyRequestController@store')->name('buyRequest.store');
    Route::delete('saved-vehicle/{id}', 'SavedVehicleController@destroy')->name('savedVehicle.destroy');
    Route::get('home', 'SavedVehicleController@index')->name('home');
});

Route::get('buy-request/thanks', function () {
    return view('buyRequest.thanks');
})->name('buyRequest.thanks');

Route::get('auth/email-authenticate/{token}',
    'Auth\LoginController@authenticateEmail')->name('auth.email-authenticate');
