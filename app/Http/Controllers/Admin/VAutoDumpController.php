<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class VAutoDumpController extends Controller
{
    protected $file;

    public function __construct()
    {
        $csvFiles = array_filter(
            File::files(realpath(base_path(config('services.vauto.uploads_path')))),
            function ($file) {
                return pathinfo($file, PATHINFO_EXTENSION) === 'csv';
            }
        );

        $this->file = reset($csvFiles);
    }

    public function __invoke()
    {

    }
}
