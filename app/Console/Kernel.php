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
        Commands\VersionFillMissingPhotos::class,
        Commands\VersionGenerateQuotes::class,
        Commands\ImportVautoMapData::class,
        Commands\Deal\DealFeatureDebugger::class,
        Commands\Deal\DealProgramDebugger::class,
        Commands\Deal\DealLeaseRatesDebugger::class,
        Commands\Deal\DealCalculatePayments::class,
        Commands\Deal\DealTestPricingChanges::class,
        Commands\Jato\JatoVersionReport::class,
        Commands\Jato\JatoDealDecode::class,
        Commands\Jato\JatoFindMissingVersions::class,
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
        $schedule->command('dmr:version:quote')->twiceDaily(2, 14);
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
