<?php

namespace App\Providers;

use DeliverMyRide\JATO\Client;
use Illuminate\Support\ServiceProvider;

class JATOServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(Client::class, function ($app) {
            return new Client(config('jato.username'), config('jato.password'));
        });
    }
}
