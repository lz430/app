<?php

use Illuminate\Support\Facades\Route;

Route::get('login', function () {
    return abort('500');
})->name('login');

Route::get('', 'WelcomeController@index')->name('home');
Route::get('filter', 'FilterController@index')->name('filter');
Route::get('compare', 'CompareController@index')->name('compare');
Route::post('hubspot', 'HubspotController@updateContact')->name('hubspot.contact.update');

Route::get('deals/{id}', 'DealsController@show')->name('deals.show');

Route::post('apply-or-purchase', 'ApplyOrPurchaseController@applyOrPurchase')->name('applyOrPurchase');
Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::get('request-email', 'ApplyOrPurchaseController@requestEmail')->name('request-email');
    Route::post('receive-email', 'ApplyOrPurchaseController@receiveEmail')->name('receive-email');

    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');
    Route::get('thank-you', 'ApplyOrPurchaseController@thankYou')->name('thank-you');

    Route::get('apply', 'ApplyOrPurchaseController@viewApply')->name('view-apply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
});
