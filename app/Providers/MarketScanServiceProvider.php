<?php

namespace App\Providers;

use DeliverMyRide\MarketScan\Client;
use Illuminate\Support\ServiceProvider;

class MarketScanServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(Client::class, function ($app) {
            return new Client(
                config('services.marketscan.url'),
                config('services.marketscan.partner_id'),
                config('services.marketscan.account_number')
            );
        });
    }
}
