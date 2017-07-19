<?php

namespace App\Providers;

use Barryvdh\Debugbar\ServiceProvider as DebugbarServiceProvider;
use Illuminate\Contracts\Logging\Log;
use Illuminate\Support\ServiceProvider;
use Psr\Log\LoggerInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        setlocale(LC_MONETARY, 'en_US.UTF-8');

        if ($this->app->environment('local')) {
            $this->app->register(DebugbarServiceProvider::class);
        }
    
        $this->app->alias('bugsnag.multi', Log::class);
        $this->app->alias('bugsnag.multi', LoggerInterface::class);
    }
}
