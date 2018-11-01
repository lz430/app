<?php

namespace App\Console\Commands;

use App\Models\JATO\Make;
use Illuminate\Console\Command;

class OutputMakes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dmr:makes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $makes = Make::LOGOS;

        $datas = [];
        foreach($makes as $make => $logo) {
            $datas[] = (object) [
              'title' => $make,
              'logo' => $logo,
              'query' => [
                'make:' . $make
              ],
            ];
        }

        print_r(json_encode($datas));
    }
}
