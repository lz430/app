<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Dealer;
use App\Http\Controllers\Controller;
use App\JATO\Version;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use League\Csv\Reader;
use League\Csv\Statement;

class StatisticsController extends Controller
{
    public function deals()
    {
        $csv = $this->csv();
        $headers = $csv->getHeader();
        $records = collect((new Statement)->process($csv));

        $vauto_dealers = $this->dealersFromCsv($records);

        $new_vehicle_count = $records->filter(function ($row) {
            return $row['New/Used'] == "N";
        })->count();

        return view('statistics.deals')
            ->with('dealers', Dealer::withCount('deals')->get())
            ->with('dealerIds', Dealer::select('dealer_id')->get()->pluck('dealer_id')->toArray())
            ->with('vauto_dealers', $vauto_dealers)
            ->with('new_vehicle_count', $new_vehicle_count)
            ->with('deals_count', Deal::count())
            ->with('jato_versions', Version::count())
            ->with('vauto_lines', $records->count());
    }

    private function dealersFromCsv($records)
    {
        $dealers = [];

        foreach ($records as $record) {
            if (! array_key_exists($record['DealerId'], $dealers)) {
                $dealers[$record['DealerId']] = [
                    'id' => $record['DealerId'],
                    'name' => $record['Dealer Name'],
                    'count_new' => 0,
                    'count_old' => 0,
                ];
            }

            if ($record['New/Used'] == 'N') {
                $dealers[$record['DealerId']]['count_new']++;
            } else {
                $dealers[$record['DealerId']]['count_old']++;
            }
        }

        return $dealers;
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

    private function csv()
    {
        $csv = Reader::createFromPath($this->vautoFilePath(), 'r');
        $csv->setHeaderOffset(0);

        return $csv;
    }
}
