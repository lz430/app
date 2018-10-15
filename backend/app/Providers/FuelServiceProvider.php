<?php

namespace App\Providers;

use DeliverMyRide\Fuel\FuelClient;

use Illuminate\Support\ServiceProvider;

class FuelServiceProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(FuelClient::class, function ($app) {
            return new FuelClient(config('services.fuel.api_key'));
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [FuelClient::class];
    }
}
