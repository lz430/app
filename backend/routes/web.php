<?php

use Illuminate\Support\Facades\Route;

Route::get('health-check', 'HealthCheckController@index');
/** External: Opt-in Monster and Hubspot */
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');

