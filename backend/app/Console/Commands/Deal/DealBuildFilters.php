<?php

namespace App\Console\Commands\Deal;

use App\Models\Deal;
use Illuminate\Console\Command;

class DealBuildFilters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:deal:filters {deal}';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dealId = $this->argument('deal');
        $deal = Deal::find($dealId);

        if (! $deal) {
            $this->info('NO DEAL!');

            return;
        }

        $munger = resolve('DeliverMyRide\VAuto\Deal\DealFiltersMunger');
        $munger->import($deal, true);

        $deal->fresh();
        $this->info($deal->id);
        $this->info($deal->title());
        $this->info(' -- Option Codes: '.implode(', ', $deal->option_codes ? $deal->option_codes : []));
        $this->info(' -- Package Codes: '.implode(', ', $deal->package_codes ? $deal->package_codes : []));

        $munger->printDiscoveredFeatures();
    }
}
