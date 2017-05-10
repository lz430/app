<?php

use Illuminate\Support\Facades\Route;

Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');

Route::get('', 'StepController@initiate');
Route::post('step-0', 'StepController@stepZero');
Route::post('step-1', 'StepController@stepOne');
Route::post('step-2', 'StepController@stepTwo');

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
