<?php

namespace App\Providers;

use DeliverMyRide\DataDelivery\DataDeliveryClient;

use Illuminate\Support\ServiceProvider;

class DataDeliveryServiceProvider extends ServiceProvider
{
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(DataDeliveryClient::class, function ($app) {
            return new DataDeliveryClient(
                config('services.datadelivery.id'),
                config('services.datadelivery.api_key')
            );
        });
    }

    /**
     * @return array
     */
    public function provides()
    {
        return [DataDeliveryClient::class];
    }
}
