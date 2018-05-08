<?php

namespace App\Providers;

use DeliverMyRide\Carleton\Client;
use Illuminate\Support\ServiceProvider;

class CarletonServiceProvider extends ServiceProvider
{
    protected $defer = true;

    public function register()
    {
        $this->app->singleton(Client::class, function ($app) {
            return new Client(
                config('services.carleton.url'),
                config('services.carleton.username'),
                config('services.carleton.password')
            );
        });
    }

    public function provides()
    {
        return [Client::class];
    }

}