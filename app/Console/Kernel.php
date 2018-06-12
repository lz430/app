<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\LoadDealsFromVauto::class,
        Commands\TestCoxAPI::class,
        Commands\JatoVersionReport::class,
        Commands\VersionFillMissingPhotos::class,
        Commands\DealFeatureDebugger::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('vauto:load')->daily()->thenPing('http://beats.envoyer.io/heartbeat/CtF23QZqY2cZ8zw');
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
