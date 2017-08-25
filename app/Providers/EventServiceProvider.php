<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\NewSessionCreated' => [
            'App\Listeners\CreateHubspotContact',
        ],
        'App\Events\UserDataChanged' => [
            'App\Listeners\UpdateHubspotContact',
        ],
        'App\Events\NewPurchaseInitiated' => [
            'App\Listeners\UpdateHubspotContact',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
