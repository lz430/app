<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::get('', 'WelcomeController@index')->name('home');

Route::get('filter', 'FilterController@index')->name('filter');

Route::get('financing/{id}', 'FinancingController@show')->name('financing');
Route::get('financing/thankyou', 'FinancingController@showThankYou')->name('financingThankYou');

Route::post('saved-vehicle', 'SavedVehicleController@store')
    ->name('savedVehicle.store');
Route::get('compare', 'CompareController@index')->name('compare');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('apply-or-purchase', 'ApplyOrPurchaseController@applyOrPurchase')->name('applyOrPurchase');
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');
    Route::get('apply', 'ApplyOrPurchaseController@viewApply')->name('viewApply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
});

Route::get('buy-request/thanks', function () {
    return view('buyRequest.thanks');
})->name('buyRequest.thanks');
