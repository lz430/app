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

    public function __invoke()
    {
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="vAutoDump-'. date('m/d/Y') .'.csv"');
        $reader = Reader::createFromPath($this->vautoFilePath(), 'r');
        $reader->output();
        die;
    }
}
