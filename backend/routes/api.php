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
Route::get('search', 'SearchController@index')->name('search.index');

Route::group(['prefix' => 'deals'], function () {
    Route::get('/', 'DealsController@list')->name('deals.index');
    Route::get('compare', 'DealsCompareController@compare')->name('deals.compare');
    Route::get('{deal}', 'DealsController@detail')->name('deals.detail');
    Route::get('{deal}/quote', 'DealQuoteController@quote')->name('deals.quote');
    Route::get('{deal}/warranties', 'DealWarrantiesController@getWarranties')->name('warranties.getWarranties');
    Route::get('{deal}/dimensions', 'DealDimensionsController@getDimensions')->name('dimensions.getDimensions');
});

Route::group(['prefix' => 'checkout'], function () {
    Route::post('start', 'CheckoutController@start')->name('checkout.start');
    Route::post('{purchase}/contact', 'CheckoutController@contact')->name('checkout.contact');
    Route::get('{purchase}/financing', 'CheckoutController@getFinancing')->name('checkout.financing');
    Route::post('{purchase}/financing', 'CheckoutController@financingComplete')->name('checkout.financingComplete');
});

Route::get('application-status', 'ApplicationStatusController@checkCompleted')->name('application.checkCompleted');
Route::get('location', 'UserLocationController@show')->name('location.show');

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');

    Route::group(['middleware' => 'auth:api'], function() {
        Route::get('logout', 'AuthController@logout');
        Route::get('user', 'AuthController@user');
    });
});


/*
 * Brochure
 */
Route::post('brochure/ticket', 'BrochureController@contact')->name('brochure.contact');

/*
 * Third-party
 */
Route::post('hubspot/not-in-area', 'HubspotController@notInServiceArea')->name('hubspot.notInArea');
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');

Route::group(['prefix' => 'webhook'], function () {
    Route::post('route-one', 'RouteOneWebhookController@handleWebhook')->name('route-one-webhook');
});
