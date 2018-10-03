<?php

namespace App\Providers;

use DeliverMyRide\HubSpot\HubspotClient;

use Illuminate\Support\ServiceProvider;

class HubSpotServiceProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(HubspotClient::class, function ($app) {
            return HubspotClient::create(config('services.hubspot.api_key'));
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [HubspotClient::class];
    }
}
