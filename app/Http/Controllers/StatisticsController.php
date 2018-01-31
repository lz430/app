<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Dealer;
use App\JATO\Version;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class StatisticsController extends Controller
{
    public function deals()
    {
        return view('statistics.deals')
            ->with('dealers', Dealer::withCount('deals')->get())
            ->with('deals_count', Deal::count())
            ->with('jato_versions', Version::count())
            ->with('vauto_lines', $this->countFileLines($this->vautoFilePath()));
    }

    private function vautoFilePath()
    {
        $csvFiles = array_filter(
            File::files(realpath(base_path(config('services.vauto.uploads_path')))),
            function ($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'csv';
            }
        );

        return reset($csvFiles);
    }

    private function vautoDealsCollection()
    {
        // @todo
        $handle = fopen($this->vautoFilePath(), 'r');

        $dealers = [];

        while (($data = fgetcsv($handle)) !== false) {
            dd($data);
            // $dealers[]
        }
    }

    // https://stackoverflow.com/a/20537130
    private function countFileLines($fileName)
    {
        $f = fopen($fileName, 'rb');
        $lines = 0;

        while (!feof($f)) {
            $lines += substr_count(fread($f, 8192), "\n");
        }

        fclose($f);

        return $lines;
    }
}
