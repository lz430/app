<?php

use Illuminate\Http\Request;
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
