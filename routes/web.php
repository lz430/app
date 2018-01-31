<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'WelcomeController@index')->name('home');
Route::get('filter', 'FilterController@index')->name('filter');
Route::get('compare', 'CompareController@index')->name('compare');

Route::get('deals/{id}', 'DealsController@show')->name('deals.show');
Route::get('confirm/{id}', 'ConfirmDetailsController@show')->name('confirm');

Route::post('apply-or-purchase', 'ApplyOrPurchaseController@applyOrInitiatePurchase')->name('applyOrPurchase');
Route::get('request-email', 'ApplyOrPurchaseController@requestEmail')->name('request-email');
Route::post('receive-email', 'ApplyOrPurchaseController@receiveEmail')->name('receive-email');

Route::post('zip-codes', 'ZipCodesController@store')->name('zipCodes.store');

Route::group(['middleware' => 'auth'], function () {
    /** Purchase Flow */
    Route::post('purchase', 'ApplyOrPurchaseController@purchase')->name('purchase');

    Route::get('apply/{purchaseId}', 'ApplyOrPurchaseController@viewApply')->name('view-apply');
    Route::post('apply', 'ApplyOrPurchaseController@apply')->name('apply');
    Route::get('thank-you', 'ApplyOrPurchaseController@thankYou')->name('thank-you');
});

/** External: Opt-in Monster and Hubspot */
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');

/** Admin */
if (App::environment(['staging', 'local'])) {
    Route::group(['prefix' => 'admin', 'namespace' => 'Admin'], function () {
        Route::view('/', 'admin');
        Route::get('zip-tester/{zip}', 'ZipCodeTesterController');
        Route::get('jato-logs/{date}', 'JatoLogController@showDay');
        Route::get('jato-logs', 'JatoLogController@index');
        Route::get('statistics/deals', 'StatisticsController@deals');
        Route::get('deal-debugger/{deal}', 'DealDebuggerController@show');
    });

    Route::redirect('jato-logs', 'admin/jato-logs');
}
