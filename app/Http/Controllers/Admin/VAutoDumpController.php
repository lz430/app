<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
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
        /*$csv = Reader::createFromPath($this->vautoFilePath(), 'r');
        $csv->setHeaderOffset(0);
        $records = collect((new Statement)->process($csv));

        return $records;*/

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="vAutoDump-'. date('m/d/Y') .'.csv"');

        $reader = Reader::createFromPath($this->vautoFilePath(), 'r');
        $reader->output();
        die;
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

        echo '<table cellpadding=15 border=1>';

        foreach ($records as $i => $record) {
            if ($i == 0) {
                echo '<tr>';
                foreach ($record as $key => $column) {
                    echo '<th>' . $key . '</th>';
                }
                echo '</tr>';
            }

            echo '<tr>';
            foreach ($record as $key => $column) {
                echo '<td>' . $column . '</td>';
            }
            echo '</tr>';
        }

        echo '</table>';
    }
}
