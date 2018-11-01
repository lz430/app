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
        Commands\OutputMakes::class,
        Commands\LoadDealsFromVauto::class,
        Commands\ImportVautoMapData::class,
        Commands\Tests\TestCoxAPI::class,
        Commands\Tests\TestHubSpotForm::class,
        Commands\Version\VersionFillMissingPhotos::class,
        Commands\Version\VersionGenerateQuotes::class,
        Commands\Version\VersionRefresh::class,
        Commands\Deal\DealFeatureDebugger::class,
        Commands\Deal\DealProgramDebugger::class,
        Commands\Deal\DealLeaseRatesDebugger::class,
        Commands\Deal\DealCalculatePayments::class,
        Commands\Deal\DealStockPhotos::class,
        Commands\Jato\JatoVersionReport::class,
        Commands\Jato\JatoDealDecode::class,
        Commands\Jato\JatoVinDecode::class,
        Commands\Jato\JatoFindMissingVersions::class,
        Commands\Audit\AuditDealPayments::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('vauto:load')->dailyAt('04:00')->sendOutputTo(storage_path('logs/import.log'));
        $schedule->command('dmr:version:quote')->twiceDaily(4, 17);
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
