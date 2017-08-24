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

Route::post('users', 'UsersController@store')->name('users.store');
Route::get('makes', 'MakesController@index')->name('makes.index');
Route::get('models', 'VehicleModelsController@index')->name('vehicleModels.index');
Route::get('body-styles', 'BodyStylesController@index')->name('bodyStyles.index');
Route::get('versions', 'VersionsController@index')->name('versions.index');
Route::get('deals', 'DealsController@getDeals')->name('deals.index');
Route::get('features', 'FeaturesController@index')->name('features.index');
Route::get('rebates', 'RebatesController@getRebates')->name('rebates.getRebates');
Route::get('rebates/best', 'RebatesController@getBestRebateIds')->name('rebates.getBestRebateIds');
Route::get('lease', 'LeaseController@getTerms')->name('lease.getTerms');
Route::get('finance', 'FinanceController@getTerms')->name('finance.getTerms');

Route::group(['middleware' => 'auth:api'], function () {
    Route::patch('users/{user}', 'UsersController@update')->name('users.update');
});

Route::group(['prefix' => 'webhook'], function () {
    Route::post('route-one', 'RouteOneWebhookController@handleWebhook')->name('route-one-webhook');
});
