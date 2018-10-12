<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Models\Dealer;
use App\Http\Controllers\Admin\Traits\ReadsVAutoDump;
use App\Http\Controllers\Controller;
use App\Models\JATO\Version;
use Illuminate\Http\Request;
use League\Csv\Reader;
use League\Csv\Statement;

class StatisticsController extends Controller
{
    use ReadsVAutoDump;

    public function deals()
    {
        $records = $this->vautoCsvRecords();

        $new_vehicle_count = $records->filter(function ($row) {
            return $row['New/Used'] == "N";
        })->count();

        return view('statistics.deals')
            ->with('dealers', Dealer::withCount('deals')->get())
            ->with('dealer_ids', Dealer::select('dealer_id')->get()->pluck('dealer_id')->toArray())
            ->with('vauto_dealers', $this->dealersFromCsv($records))
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

    private function vautoCsvRecords()
    {
        $csv = Reader::createFromPath($this->vautoFilePath(), 'r');
        $csv->setHeaderOffset(0);
        $records = collect((new Statement)->process($csv));

        return $records;
    }
}
