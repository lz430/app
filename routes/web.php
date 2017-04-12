<?php

use App\JATO\Make;
use App\JATO\Version;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('step-0')
        ->with('makes', Make::select('id', 'name')->with(['models' => function ($query) {
            $query->select('id', 'name', 'make_id');
        }])->get());
});

Route::post('/step-0', function () {
    $versions = Version::where('model_id', request()->get('model_id'))->get();

    return view('step-1-versions')->with('versions', $versions);
});

Route::post('/step-1', function () {
    $options = \App\JATO\VersionOption::where('version_id', request()->get('version_id'))->get();

    return view('step-2-options')
        ->with('options', $options)
        ->with('versionId', request()->get('version_id'));
});

Route::post('/step-2', function () {
    $options = \App\JATO\VersionOption::where('version_id', request()->get('version_id'))->get();
    $version = Version::findOrFail(request()->get('version_id'));

    return view('step-3-buy-or-save')
        ->with('options', $options)
        ->with('selectedOptionIds', request()->get('option_ids'))
        ->with('version', $version);
});

Route::post('/save', function () {
    /** @var \App\User $user */
    $user = \App\User::firstOrCreate([
        'email' => request()->get('email'),
    ], [
        'email' => request()->get('email'),
        'name' => '',
        'password' => Hash::make(str_random(8))
    ]);

    /** @var \App\SavedVehicle $savedVehicle */
    $savedVehicle = \App\SavedVehicle::create([
        'user_id' => $user->id,
        'version_id' => request()->get('version_id')
    ]);

    $savedVehicle->options()->sync(request()->get('option_ids'));

    Auth::loginUsingId($user->id);

    return redirect()->to('/garage');
});

Route::get('/garage', function () {
    $user = Auth::user();

    // TODO: eager load
    return view('garage')->with('savedVehicles', $user->savedVehicles);
})->middleware('auth');
