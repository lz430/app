<?php

namespace App\Providers;

use DeliverMyRide\JATO\JatoClient;
use Illuminate\Support\ServiceProvider;

class JATOServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(JatoClient::class, function ($app) {
            return new JatoClient(config('services.jato.username'), config('services.jato.password'));
        });
    }
}
