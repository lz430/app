<?php

namespace App\JATO;

use Illuminate\Support\Facades\File;
use function storage_path;

class Log
{
    protected $filename;

    public function __construct()
    {
        $this->filename = storage_path('logs/jato.log');
    }

    public function info($message, $details = [])
    {
        $this->log('info', $message, $details);
    }

    public function error($message, $details = [])
    {
        $this->log('error', $message, $details);
    }

    public function log($level, $message, $details)
    {
        $date = date('[Y-m-d h:i:s] ');
        $level = strtoupper($level) . ': ';
        $details = empty($details) ? '' : ' | ' . print_r($details, true);
        File::append($this->filename, $date . $level . $message . $details . "\n");
    }
}
