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
    Route::get('{deal}', 'DealsController@detail')->name('deals.detail');
    Route::get('{deal}/quote', 'DealQuoteController@quote')->name('deals.quote');
});

Route::group(['prefix' => 'checkout', 'namespace' => 'Order'], function () {
    Route::post('start', 'CheckoutController@start')->name('checkout.start');
    Route::post('{purchase}/contact', 'CheckoutController@contact')->name('checkout.contact');
    Route::get('{purchase}/financing', 'CheckoutController@getFinancing')->name('checkout.financing');
    Route::post('{purchase}/financing', 'CheckoutController@financingComplete')->name('checkout.financingComplete');
});

Route::group(['prefix' => 'order', 'namespace' => 'Order', 'middleware' => 'auth:api'], function () {
    Route::get('/', 'OrderController@list')->name('order.list');
});

Route::get('application-status', 'ApplicationStatusController@checkCompleted')->name('application.checkCompleted');

Route::group(['prefix' => 'auth', 'namespace' => 'User'], function () {
    Route::post('login', 'UserAuthController@login');
    Route::post('registration', 'UserAuthController@registration');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('logout', 'UserAuthController@logout');
        Route::get('user', 'UserAuthController@user');
        Route::post('password', 'UserPasswordChangeController@change');
    });
});

Route::group(['prefix' => 'user', 'namespace' => 'User'], function () {
    Route::get('location', 'UserLocationController@show')->name('location.show');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('me', 'UserController@me');
        Route::post('update', 'UserController@update');
    });
});

Route::group(['prefix' => 'password', 'namespace' => 'User'], function () {
    Route::post('create', 'UserPasswordResetController@create');
    Route::get('find/{token}', 'UserPasswordResetController@find');
    Route::post('reset', 'UserPasswordResetController@reset');
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
