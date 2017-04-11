<?php

use App\JATO\Make;
use App\JATO\Version;
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
