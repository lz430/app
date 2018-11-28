<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class VAutoDumpController extends Controller
{
    public function getFiles()
    {
        $files = Storage::disk('s3')->files('logs/vauto');

        $files = collect($files)
            ->map(function ($item) {
                $name = explode('/', $item);
                $name = end($name);

                $url = Storage::disk('s3')->temporaryUrl(
                    $item, now()->addMinutes(5)
                );

                return (object)[
                    'path' => $item,
                    'name' => $name,
                    'url' => $url,
                ];
            })
            ->sortByDesc(function($item) {
                return $item->name;
            });

        return view('admin.vauto-archives', ['files' => $files]);
    }

    public function downloadFile($filename)
    {
        return response()->download(realpath(base_path('storage/app/public/importbackups/' . $filename)));
    }
}
