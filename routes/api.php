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
Route::get('features', 'FeaturesController@index')->name('features.index');
Route::get('categories', 'CategoriesController@index')->name('categories.index');
Route::get('makes', 'MakesController@index')->name('makes.index');
Route::get('models', 'VehicleModelsController@index')->name('vehicleModels.index');
Route::get('body-styles', 'BodyStylesController@index')->name('bodyStyles.index');

Route::get('dealsByModelYear', 'DealsByModelYearController@getDealsByModelYear')->name('dealsByModelYear.index');

Route::get('deals', 'DealsController@getDeals')->name('deals.index');
Route::get('deals/compare', 'DealsCompareController@compare')->name('deals.compare');
Route::get('warranties', 'WarrantiesController@getWarranties')->name('warranties.getWarranties');
Route::get('dimensions', 'DimensionsController@getDimensions')->name('dimensions.getDimensions');
Route::get('deals/{deal}/quote', 'DealQuoteController@quote')->name('deals.quote');

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
