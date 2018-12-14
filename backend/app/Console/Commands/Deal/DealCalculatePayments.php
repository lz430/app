<?php

namespace App\Console\Commands\Deal;

use App\Models\Deal;
use Illuminate\Console\Command;

class DealCalculatePayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:deal:payments {deal?}';
    private $details = false;

    private function calculatePayments(Deal $deal)
    {
        $calculator = resolve('App\Services\Quote\DealBuildBasicPayments');
        $payments = $calculator->calculateBasicPayments($deal);
        $this->info($deal->title());

        if ($this->details) {
            foreach ($payments->detroit as $strategy => $info) {
                $this->info($strategy);
                $rows = [];
                if ($info) {
                    foreach ($info as $key => $value) {
                        $rows[] = [
                            $key,
                            $value,
                        ];
                    }
                    $this->table([], $rows);
                } else {
                    $this->info(' -- No results');
                }
            }
        }
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
            $this->details = true;
            $deal = Deal::where('id', $dealId)->first();
            if ($deal->status == 'available') {
                $this->calculatePayments($deal);
            }
        } else {
            Deal::chunk(500, function ($deals) {
                foreach ($deals as $deal) {
                    if ($deal->status == 'available') {
                        $this->calculatePayments($deal);
                    }
                }
            });
        }

        return true;
    }
}
