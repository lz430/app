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
    CRUD::resource('deal', 'DealCrudController');
    CRUD::resource('dealer', 'DealerCrudController');
    CRUD::resource('feature', 'FeatureCrudController');
    CRUD::resource('category', 'CategoryCrudController');
    CRUD::resource('purchase', 'OrderCrudController');

    //
    // Deal tools
    Route::get('deal/{deal}/debugger', 'DealDebuggerController@show');
    Route::get('deal/{deal}', 'DealDataController@show');
    Route::get('deal/{deal}/financing', 'DealFinancingController@show');

    //
    // Dealer tools
    Route::get('dealer/{dealer}/routeone', 'DealerRouteoneController@show');

    //
    // Reports
    Route::get('reports/versions-missing-images', 'ReportVersionsMissingPhotosController@index');
    Route::get('reports/deals-without-rules', 'ReportDealsWithoutRulesController@index');
    Route::get('reports/dealer-price-rules', 'ReportDealerPriceRulesController@index');
    Route::get('reports/dealer-price-rules/export', 'ReportDealerPriceRulesController@export');

    // Archived vAuto Dumps
    Route::get('archived-dumps', 'VAutoDumpController@getFiles');
    Route::get('archived-dumps/download/{filename}', 'VAutoDumpController@downloadFile');

    //
    // Custom Debug tools
    Route::get('jato-logs/{date}', 'JatoLogController@showDay');
    Route::get('jato-logs', 'JatoLogController@index');
    Route::get('statistics/deals', 'StatisticsController@deals');
});
