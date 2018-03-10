<?php

namespace App\Http\Controllers\Admin\Traits;

use Illuminate\Support\Facades\File;

trait ReadsVAutoDump
{
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
}
