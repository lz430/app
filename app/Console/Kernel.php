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
        Commands\JatoDealDecode::class,
        Commands\DealFeatureDebugger::class,
        Commands\ImportVautoMapData::class,
        Commands\DealProgramDebugger::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('vauto:load')->daily()->sendOutputTo(storage_path('logs/import.log'));
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
