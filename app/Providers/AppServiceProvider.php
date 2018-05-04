<?php

namespace App\Providers;

use Barryvdh\Debugbar\ServiceProvider as DebugbarServiceProvider;
use Illuminate\Contracts\Logging\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;
use Psr\Log\LoggerInterface;
use USDLRegex\Validator as LicenseValidator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('drivers_license_number', function ($attribute, $value, $parameters, $validator) {
            $licenseValidator = new LicenseValidator([
                'verbose' => false,
                'caseInsensitive' => true,
            ]);

            return $licenseValidator->validate(
                $validator->getData()['drivers_license_state'],
                $value
            );
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        setlocale(LC_MONETARY, 'en_US.UTF-8');
    }
}
