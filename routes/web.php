<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::get('', 'WelcomeController@index')->name('home');

Route::get('filter', 'FilterController@index')->name('filter');

Route::get('compare', 'CompareController@index')->name('compare');

Route::group(['middleware' => 'auth'], function () {
    Route::get('buy-request/create', 'BuyRequestController@create')->name('buyRequest.create');
    Route::post('buy-request', 'BuyRequestController@store')->name('buyRequest.store');
    Route::delete('saved-vehicle/{id}', 'SavedVehicleController@destroy')->name('savedVehicle.destroy');

    /** Purchase Flow */
    Route::get('apply-or-purchase', 'ApplyOrPurchaseController@applyOrPurchase')->name('applyOrPurchase');
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');
    Route::get('apply', 'ApplyOrPurchaseController@viewApply')->name('viewApply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
});

Route::get('buy-request/thanks', function () {
    return view('buyRequest.thanks');
})->name('buyRequest.thanks');
