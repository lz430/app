<?php

namespace App\Console\Commands\Deal;

use Illuminate\Console\Command;
use App\Models\Deal;

class DealCalculatePayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:deal:payments {deal?}';

    private function calculatePayments(Deal $deal)
    {
        $calculator = resolve('App\Services\Quote\DealCalculateBasicPayments');
        $calculator->calculateBasicPayments($deal);
        $this->info($deal->title());
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        \DB::connection()->disableQueryLog();

        $dealId = $this->argument('deal');
        if ($dealId) {
            $deal = Deal::where('id', $dealId)->get()->first();
            $this->calculatePayments($deal);

        } else {
            Deal::chunk(500, function ($deals) {
                foreach ($deals as $deal) {
                    $this->calculatePayments($deal);
                }
            });
        }
        return true;
    }
}
