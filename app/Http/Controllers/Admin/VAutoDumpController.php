<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Admin\Traits\ReadsVAutoDump;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
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

    public function getFiles()
    {
        $files = File::files(realpath(base_path('storage/app/public/importbackups')));
        $data = [];
        foreach($files as $file) {
            $data[]['filename'] = $file->getFilename();
        }
        return view('admin.vauto-archives', ['dumps' => $data]);
    }

    public function downloadFile($filename)
    {
        return response()->download(realpath(base_path('storage/app/public/importbackups/' . $filename)));
    }
}
