<?php

use App\JATO\Make;
use App\JATO\Version;
use App\JATO\VersionOption;
use Illuminate\Support\Facades\Route;

Route::get('', function () {
    $makes = Make::select('id', 'name')->with(['models' => function ($query) {
        $query->select('id', 'name', 'make_id');
    }])->get();

    return view('step-0')
        ->with('makes', $makes);
});

Route::post('step-0', function () {
    $versionsGrouped = Version::where('model_id', request()->input('model_id'))
        ->get()
        ->groupBy('trim_name')
        ->map(function ($group) {
            return $group->groupBy('body_style');
        });

    return view('step-1-versions')->with('versionsGrouped', $versionsGrouped);
});

Route::post('step-1', function () {
    $options = VersionOption::where('version_id', request()->input('version_id'))->get();

    return view('step-2-options')
        ->with('options', $options)
        ->with('version', Version::findOrFail(request()->input('version_id')))
        ->with('versionId', request()->input('version_id'));
});

Route::post('step-2', function () {
    $options = VersionOption::where('version_id', request()->input('version_id'))->get();
    $version = Version::with('taxesAndDiscounts')->findOrFail(request()->input('version_id'));

    return view('step-3-buy-or-save')
        ->with('options', $options)
        ->with('selectedOptions', VersionOption::whereIn('id', request()->input('option_ids'))->get())
        ->with('selectedOptionIds', request()->input('option_ids'))
        ->with('version', $version);
});

Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');

Route::post('saved-vehicle', [
    'as' => 'savedVehicle.store',
    'uses' => 'SavedVehicleController@store'
]);

Route::delete('saved-vehicle/{id}', [
    'as' => 'savedVehicle.destroy',
    'uses' => 'SavedVehicleController@destroy'
])->middleware('auth');

Route::get('auth/email-authenticate/{token}', [
    'as' => 'auth.email-authenticate',
    'uses' => 'Auth\LoginController@authenticateEmail'
]);

Route::get('home', [
    'as' => 'home',
    'uses' => 'SavedVehicleController@index'
])->middleware('auth');
