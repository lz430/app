<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class VAutoDumpController extends Controller
{
    public function getFiles()
    {
        $files = File::isDirectory(realpath(base_path('storage/app/public/importbackups'))) ? File::files(realpath(base_path('storage/app/public/importbackups'))) : null;

        $collection = collect($files)
            ->sortByDesc(function($file) {
                return $file->getCTime();
            });

        $data = [];
        if(isset($files)) {
            foreach($collection as $file) {
                $data[]['filename'] = $file->getFilename();
            }
        } else {
            $data = null;
        }

        return view('admin.vauto-archives', ['dumps' => $data]);
    }

    public function downloadFile($filename)
    {
        return response()->download(realpath(base_path('storage/app/public/importbackups/' . $filename)));
    }
}
