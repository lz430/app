<?php

use Illuminate\Support\Facades\Route;

Route::get('health-check', 'HealthCheckController@index');
