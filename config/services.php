<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'jato' => [
        'username' => env('JATO_USERNAME'),
        'password' => env('JATO_PASSWORD'),
    ],

    'vauto' => [
        'uploads_path' => env('VAUTO_UPLOADS_PATH'),
    ],
    
    'fuel' => [
        'api_key' => env('FUEL_API_KEY'),
    ],

    'marketscan' => [
        'url' => env('MARKET_SCAN_URL'),
        'partner_id' => env('MARKET_SCAN_PARTNER_ID'),
        'account_number' => env('MARKET_SCAN_ACCOUNT_NUMBER'),
    ],
    'hubspot' => [
        'api_key' => env('HUBSPOT_API_KEY'),
    ],
];
