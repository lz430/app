<?php

use Illuminate\Support\Facades\Route;

Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');

Route::get('', 'WelcomeController@index');

Route::get('filter', 'FilterController@index')->name('filter');

Route::post('saved-vehicle', 'SavedVehicleController@store')
    ->name('savedVehicle.store');

Route::group(['middleware' => 'auth'], function () {
    Route::get('buy-request/create', 'BuyRequestController@create')->name('buyRequest.create');
    Route::post('buy-request', 'BuyRequestController@store')->name('buyRequest.store');
    Route::delete('saved-vehicle/{id}', 'SavedVehicleController@destroy')->name('savedVehicle.destroy');
    Route::get('home', 'SavedVehicleController@index')->name('home');

    /** Purchase Flow */
    Route::get('apply-or-purchase', 'ApplyOrPurchaseController@applyOrPurchase')->name('applyOrPurchase');
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');
    Route::get('apply', 'ApplyOrPurchaseController@viewApply')->name('viewApply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
});

Route::get('buy-request/thanks', function () {
    return view('buyRequest.thanks');
})->name('buyRequest.thanks');

Route::get('auth/email-authenticate/{token}',
    'Auth\LoginController@authenticateEmail')->name('auth.email-authenticate');
