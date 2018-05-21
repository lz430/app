<?php

namespace App\Providers;

use DeliverMyRide\Cox\CoxClient;

use Illuminate\Support\ServiceProvider;

class CoxServiceProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(CoxClient::class, function ($app) {
            return new CoxClient(config('services.cox.api_key'));
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [CoxClient::class];
    }
}
