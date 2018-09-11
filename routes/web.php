<?php

use Illuminate\Support\Facades\Route;
/*
Route::get('filter', 'FilterController@index')->name('filter');
Route::get('deals/{deal}', 'DealsController@show')->name('deals.show');

*/

Route::get('/', 'WelcomeController@index')->name('home');
Route::get('filter', 'AppController@index')->name('filter');
Route::get('deals/{deal}', 'AppController@index')->name('deals.show');

Route::get('compare', 'CompareController@index')->name('compare');

Route::get('confirm/{id}', 'ConfirmDetailsController@show')->name('confirm');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');

    Route::get('apply/{purchaseId}', 'ApplyOrPurchaseController@viewApply')->name('view-apply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
    Route::get('thank-you', 'ApplyOrPurchaseController@thankYou')->name('thank-you');
});

Route::get('health-check', 'HealthCheckController@index');
/** External: Opt-in Monster and Hubspot */
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');

