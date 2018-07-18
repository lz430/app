<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'WelcomeController@index')->name('home');
Route::get('filter', 'FilterController@index')->name('filter');
Route::get('compare', 'CompareController@index')->name('compare');

Route::get('deals/{deal}', 'DealsController@show')->name('deals.show');
Route::get('confirm/{id}', 'ConfirmDetailsController@show')->name('confirm');

Route::get('testing', 'WelcomeController@testing');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');

    Route::get('apply/{purchaseId}', 'ApplyOrPurchaseController@viewApply')->name('view-apply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
    Route::get('thank-you', 'ApplyOrPurchaseController@thankYou')->name('thank-you');
});

/** External: Opt-in Monster and Hubspot */
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');
