<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'WelcomeController@index')->name('home');
Route::get('filter', 'AppController@index')->name('filter');
Route::get('deals/{deal}', 'AppController@index')->name('deals.show');
Route::get('compare', 'AppController@index')->name('compare');
Route::get('confirm/{id}', 'AppController@index')->name('confirm');
Route::get('apply/{purchaseId}', 'AppController@index')->name('view-apply');
Route::get('thank-you', 'AppController@index')->name('thank-you');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
});

Route::get('health-check', 'HealthCheckController@index');
/** External: Opt-in Monster and Hubspot */
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');

