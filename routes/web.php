<?php

use App\JATO\Make;
use App\JATO\Version;
use App\SavedVehicle;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('', function () {
    return view('step-0')
        ->with('makes', Make::select('id', 'name')->with(['models' => function ($query) {
            $query->select('id', 'name', 'make_id');
        }])->get());
});

Route::post('step-0', function () {
    $versions = Version::where('model_id', request()->input('model_id'))->get();

    return view('step-1-versions')->with('versions', $versions);
});

Route::post('step-1', function () {
    $options = \App\JATO\VersionOption::where('version_id', request()->input('version_id'))->get();

    return view('step-2-options')
        ->with('options', $options)
        ->with('versionId', request()->input('version_id'));
});

Route::post('step-2', function () {
    $options = \App\JATO\VersionOption::where('version_id', request()->input('version_id'))->get();
    $version = Version::findOrFail(request()->input('version_id'));

    return view('step-3-buy-or-save')
        ->with('options', $options)
        ->with('selectedOptionIds', request()->input('option_ids'))
        ->with('version', $version);
});

Route::post('save', function () {
    /** @var \App\User $user */
    $user = \App\User::firstOrCreate([
        'email' => request()->input('email'),
    ], [
        'email' => request()->input('email'),
        'name' => '',
        'password' => Hash::make(str_random(8))
    ]);

    /** @var SavedVehicle $savedVehicle */
    $savedVehicle = SavedVehicle::create([
        'user_id' => $user->id,
        'version_id' => request()->input('version_id')
    ]);

    $savedVehicle->options()->sync(request()->input('option_ids'));

    Mail::send('auth.emails.email-login', ['url' => route('home')], function (Message $message) {
        $message->from('noreply@delivermyride.com', config('name'));
        $message->to(request()->input('email'))->subject(config('name') . ' Garage');
    });

    Auth::loginUsingId($user->id);

    return redirect()->to('home');
});

Route::get('login', 'Auth\LoginController@showLoginForm')->name('login');
Route::post('login', 'Auth\LoginController@login');

Route::get('auth/email-authenticate/{token}', [
    'as' => 'auth.email-authenticate',
    'uses' => 'Auth\LoginController@authenticateEmail'
]);

Route::get('home', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);
