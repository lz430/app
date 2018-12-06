<?php

namespace DeliverMyRide\VAuto;

use Illuminate\Support\Facades\Storage;
use League\Flysystem\MountManager;

class VautoFileManager
{

    /**
     * @return \Illuminate\Contracts\Filesystem\Filesystem|\Illuminate\Filesystem\FilesystemAdapter
     */
    private function loadVautoStorageDisk()
    {
        return Storage::disk((config('services.vauto.load_from') === 'remote' ? 'vauto_remote' : 'vauto'));
    }

    /**
     * @return array
     * @throws \League\Flysystem\FileExistsException
     */
    public function downloadAllFiles(): array
    {
        $vautoStorage = $this->loadVautoStorageDisk();

        $mountManager = new MountManager([
            'temp' => \Storage::disk('temp')->getDriver(),
            'vauto' => $vautoStorage->getDriver(),
        ]);

        $vautoFiles = $vautoStorage->files('uploads');
        $vautoFiles = collect($vautoFiles)
            ->filter(function ($item) {
                return pathinfo($item, PATHINFO_EXTENSION) === 'csv';
            })->all();

        $files = [];

        foreach ($vautoFiles as $key => $file) {
            $newName = str_random(10) . ".csv";
            $mountManager->copy(
                'vauto://' . $file,
                'temp://' . $newName
            );

            $files[] = [
                'name' => $newName,
                'path' => sys_get_temp_dir() . '/' . $newName,
                'hash' => md5_file(sys_get_temp_dir() . '/' . $newName),
            ];
        }

        return $files;
    }

    /**
     * @param $sources
     * @throws \League\Flysystem\FileExistsException
     */
    public function archiveFiles($sources)
    {
        if (config('filesystems.disks.s3.region')) {
            $mountManager = new MountManager([
                's3' => \Storage::disk('s3')->getDriver(),
                'temp' => \Storage::disk('temp')->getDriver(),
            ]);
            foreach ($sources as $key => $source) {
                $newName = 'vAuto_DMR-' . date('m-d-Y') . '-' . $key . '.csv';
                $mountManager->copy(
                    'vauto://' . $source['name'],
                    's3://logs/vauto/' . $newName,
                    [
                        'ContentType' => 'text/csv',
                        'ContentDisposition' => 'attachment',
                    ]
                );
            }
        }
    }
}
