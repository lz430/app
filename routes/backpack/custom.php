<?php

// --------------------------
// Custom Backpack Routes
// --------------------------
// This route file is loaded automatically by Backpack\Base.
// Routes you generate using Backpack\Generators will be placed here.

Route::group([
    'prefix'     => config('backpack.base.route_prefix', 'admin'),
    'middleware' => ['web', config('backpack.base.middleware_key', 'admin')],
    'namespace'  => 'App\Http\Controllers\Admin',
], function () {
    //
    // General admin things
    Route::get('dashboard', 'DashboardController@index');

    //
    // Models
    CRUD::resource('dealer', 'DealerCrudController');
    CRUD::resource('user', 'UserCrudController');

    //
    // Custom Debug tools
    Route::get('zip-tester/{zip}', 'ZipCodeTesterController');
    Route::get('jato-logs/{date}', 'JatoLogController@showDay');
    Route::get('jato-logs', 'JatoLogController@index');
    Route::get('vauto-dump', 'VAutoDumpController');
    Route::get('statistics/deals', 'StatisticsController@deals');
    Route::get('deal-debugger/{deal}', 'DealDebuggerController@show');
    Route::get('deal-feature-debugger/{deal}', 'DealFeatureDebuggerController@show');
    Route::post('deal-by-vin', 'DealDebuggerController@vinLookup');
});
