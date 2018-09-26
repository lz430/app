<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'WelcomeController@index')->name('home');
Route::get('filter', 'AppController@index')->name('filter');
Route::get('deals/{deal}', 'AppController@index')->name('deals.show');
Route::get('compare', 'AppController@index')->name('compare');
Route::get('checkout/contact', 'AppController@index')->name('confirm');
Route::get('checkout/financing', 'AppController@index')->name('view-apply');
Route::get('checkout/complete', 'AppController@index')->name('thank-you');

Route::get('health-check', 'HealthCheckController@index');
/** External: Opt-in Monster and Hubspot */
Route::post('set-email', 'OptinMonsterController@setEmailSession')->name('set-email');

