<?php

namespace App\JATO;

use Illuminate\Support\Facades\File;
use function storage_path;

class Log
{
    protected $filename;
    protected $log_level;

    protected $logLevels = [
        'error',
        'info',
        'debug',
    ];

    public function __construct()
    {
        $this->filename = storage_path('logs/jato.log');
        $this->log_level = config('app.log_level');
    }

    public function debug($message, $details = [])
    {
        $this->log('debug', $message, $details);
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
        if (! $this->shouldLog($level)) {
            return;
        }

        $date = date('[Y-m-d h:i:s] ');
        $level = strtoupper($level) . ': ';
        $details = empty($details) ? '' : ' | ' . print_r($details, true);
        File::append($this->filename, $date . $level . $message . $details . "\n");
    }

    private function shouldLog($level)
    {
        return array_search($level, $this->logLevels) <= array_search($this->log_level, $this->logLevels);
    }
}
