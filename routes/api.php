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

Route::get('makes', 'MakesController@index')->name('makes.index');
Route::get('models', 'VehicleModelsController@index')->name('vehicleModels.index');
Route::get('body-styles', 'BodyStylesController@index')->name('bodyStyles.index');
Route::get('versions', 'VersionsController@index')->name('versions.index');
Route::get('deals', 'DealsController@getDeals')->name('deals.index');
Route::get('dealsByModelYear', 'DealsByModelYearController@getDealsByModelYear')->name('dealsByModelYear.index');
Route::get('deals/{deal}/best-offer', 'DealBestOfferController@getBestOffer')->name('deals.best-offer');
Route::get('features', 'FeaturesController@index')->name('features.index');
Route::get('targets', 'TargetsController@getTargets')->name('targets.getTargets');
Route::get('warranties', 'WarrantiesController@getWarranties')->name('warranties.getWarranties');
Route::get('lease-rates', 'LeaseRatesController@getLeaseRates')->name('lease-rates.getLeaseRates');
Route::get('dimensions', 'DimensionsController@getDimensions')->name('dimensions.getDimensions');
Route::get('application-status', 'ApplicationStatusController@checkCompleted')->name('application.checkCompleted');
Route::get('zip-codes/{code}', 'ZipCodesController@show')->name('zipCodes.show');
Route::get('categories', 'CategoriesController@index')->name('categories.index');

/**
 * Third-party
 */

Route::post('hubspot/not-in-area', 'HubspotController@notInServiceArea')->name('hubspot.notInArea');

Route::group(['prefix' => 'webhook'], function () {
    Route::post('route-one', 'RouteOneWebhookController@handleWebhook')->name('route-one-webhook');
});
