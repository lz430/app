<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'WelcomeController@index')->name('home');
Route::get('filter', 'FilterController@index')->name('filter');
Route::get('compare', 'CompareController@index')->name('compare');

Route::get('deals/{id}', 'DealsController@show')->name('deals.show');
Route::get('confirm/{id}', 'ConfirmDetailsController@show')->name('confirm');

Route::post('apply-or-purchase', 'ApplyOrPurchaseController@applyOrPurchase')->name('applyOrPurchase');
Route::get('request-email', 'ApplyOrPurchaseController@requestEmail')->name('request-email');
Route::post('receive-email', 'ApplyOrPurchaseController@receiveEmail')->name('receive-email');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');

    Route::get('apply', 'ApplyOrPurchaseController@viewApply')->name('view-apply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
    Route::get('thank-you', 'ApplyOrPurchaseController@thankYou')->name('thank-you');
});

/** External: Opt-in Monster and Hubspot */
Route::post('hubspot', 'HubspotController@updateContact')->name('hubspot.contact.update');
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');
