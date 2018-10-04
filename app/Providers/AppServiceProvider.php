<?php

namespace App\Providers;


use App\Observers\DealObserver;
use Illuminate\Contracts\Logging\Log;
use  Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;
use USDLRegex\Validator as LicenseValidator;
use App\Models\Deal;
use App\Models\Dealer;
use App\Models\Feature;
use App\Models\Order\Purchase;
use App\Models\JATO\Version;
use App\Models\JATO\VersionQuote;
use App\Observers\DealerObserver;
use App\Observers\FeatureObserver;
use App\Observers\VersionObserver;
use App\Observers\VersionQuoteObserver;
use App\Observers\PurchaseObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if(in_array(config('app.env'), ['staging', 'production'])) {
            //Observers for model event listeners
            Dealer::observe(DealerObserver::class);
            Feature::observe(FeatureObserver::class);
            Version::observe(VersionObserver::class);
        }

        Purchase::observe(PurchaseObserver::class);
        VersionQuote::observe(VersionQuoteObserver::class);
        Deal::observe(DealObserver::class);

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

        if(in_array(config('app.env'), ['staging', 'production'])) {
            URL::forceScheme('https');
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->environment() !== 'production') {
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
        }

        setlocale(LC_MONETARY, 'en_US.UTF-8');
    }
}
