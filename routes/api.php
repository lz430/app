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
Route::get('deals', 'DealsController@index')->name('deals.index');

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('saved-vehicles', 'SavedVehiclesController@index')->name('savedVehicles.index');
    Route::patch('users/{user}', 'UsersController@update')->name('users.update');
});
