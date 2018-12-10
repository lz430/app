<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */
    'default' => env('LOG_CHANNEL', 'stack'),
    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, Laravel uses the Monolog PHP logging library. This gives
    | you a variety of powerful log handlers / formatters to utilize.
    |
    | Available Drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "custom", "stack"
    |
    */
    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['errorlog', 'sentry'],
        ],
        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => 'notice',
        ],
        'jato' => [
            'driver' => 'single',
            'path' => storage_path('logs/jato.log'),
            'level' => 'notice',
        ],
        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => 'notice',
            'days' => 7,
        ],
        'syslog' => [
            'driver' => 'syslog',
            'level' => 'notice',
        ],
        'errorlog' => [
            'driver' => 'errorlog',
            'level' => 'notice',
        ],
        'sentry' => [
            'driver' => 'sentry',
            'level' => 'notice',
        ],
    ],
];
