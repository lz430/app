<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('dealsByModelYear', 'DealsByModelYearController@getDealsByModelYear')->name('dealsByModelYear.index');
Route::get('deals', 'DealsController@list')->name('deals.index');
Route::get('deals/{deal}/image/{index}', 'DealsController@image')->name('deals.image');
Route::get('deals/compare', 'DealsCompareController@compare')->name('deals.compare');
Route::get('deals/{deal}/quote', 'DealQuoteController@quote')->name('deals.quote');
Route::get('deals/{deal}/warranties', 'DealWarrantiesController@getWarranties')->name('warranties.getWarranties');
Route::get('deals/{deal}/dimensions', 'DealDimensionsController@getDimensions')->name('dimensions.getDimensions');

Route::post('checkout/start', 'CheckoutController@start')->name('checkout.start');
Route::post('checkout/contact', 'CheckoutController@contact')->name('checkout.contact');

Route::get('targets', 'TargetsController@getTargets')->name('targets.getTargets');
Route::get('application-status', 'ApplicationStatusController@checkCompleted')->name('application.checkCompleted');
Route::get('location', 'UserLocationController@show')->name('location.show');

/**
 * Third-party
 */

Route::post('hubspot/not-in-area', 'HubspotController@notInServiceArea')->name('hubspot.notInArea');

Route::group(['prefix' => 'webhook'], function () {
    Route::post('route-one', 'RouteOneWebhookController@handleWebhook')->name('route-one-webhook');
});
