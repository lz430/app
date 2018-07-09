<?php

namespace App\Providers;

use DeliverMyRide\RIS\RISClient;

use Illuminate\Support\ServiceProvider;

class RISServiceProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(RISClient::class, function ($app) {
            return new RISClient(config('services.cox.api_key'));
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [RISClient::class];
    }
}
