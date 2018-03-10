<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Http\Controllers\Admin\Traits\ReadsVAutoDump;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use League\Csv\Reader;
use League\Csv\Statement;

class VAutoDumpController extends Controller
{
    use ReadsVAutoDump;

    protected $file;

    public function __construct()
    {
        $this->file = $this->vautoFilePath();
    }

    private function vautoCsvRecords()
    {
        $csv = Reader::createFromPath($this->vautoFilePath(), 'r');
        $csv->setHeaderOffset(0);
        $records = collect((new Statement)->process($csv));

        return $records;
    }

    public function __invoke()
    {
        $perPage = 10000;
        $offset = (request('page', 1) - 1) * $perPage;
        $records = $this->vautoCsvRecords();
        $count = $records->count();
        $records = $records->splice($offset)->take($perPage);

        $totalPages = ceil($count / $perPage);

        echo 'Pages ';
        for ($i = 1; $i <= $totalPages; $i++) {
            if ($i == request('page', 1)) {
                echo '| ' . $i . ' ';
            } else {
                echo '| <a href="?page=' . $i . '">' . $i . '</a> ';
            }
        }

        echo '<hr>';

        // @todo make this a huge table instead of a bunch of json dumps?
        foreach ($records as $record) {
            echo '<pre>' . json_encode($record, JSON_PRETTY_PRINT) . '</pre>';
            echo '<hr>';
        }
    }
}
