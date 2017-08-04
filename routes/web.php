<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Auth::routes();

Route::get('', 'WelcomeController@index')->name('home');
Route::get('filter', 'FilterController@index')->name('filter');
Route::get('compare', 'CompareController@index')->name('compare');
Route::post('hubspot', 'HubspotController@updateContact')->name('hubspot.contact.update');

Route::get('deals/{id}', 'DealsController@show')->name('deals.show');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('apply-or-purchase', 'ApplyOrPurchaseController@applyOrPurchase')->name('applyOrPurchase');
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');
    Route::get('thank-you', 'ApplyOrPurchaseController@thankYou')->name('thank-you');
    
    Route::get('apply', 'ApplyOrPurchaseController@viewApply')->name('viewApply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
});
