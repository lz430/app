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
        'model' => App\Models\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'jato' => [
        'username' => env('JATO_USERNAME'),
        'password' => env('JATO_PASSWORD'),
        'subscription_key' => env('JATO_KEY', 'e37102e58e4f42bf927743e6e92c41c3'),
    ],

    'vauto' => [
        'uploads_path' => env('VAUTO_UPLOADS_PATH'),
    ],

    'fuel' => [
        'api_key' => env('FUEL_API_KEY'),
    ],

    'hubspot' => [
        'api_key' => env('HUBSPOT_API_KEY'),
    ],

    'carleton' => [
        'username' => env('CARLETON_USERNAME'),
        'password' => env('CARLETON_PASSWORD'),
        'url' => env('CARLETON_URL'),
    ],

    'cox' => [
        'api_key' => env('COX_API_KEY'),
    ],

    'datadelivery' => [
        'id' => env('DATADELIVERY_ID'),
        'api_key' => env('DATADELIVERY_API_KEY'),
    ],

    'ipstack' => [
        'api_key' => env('IPSTACK_API_KEY'),
    ],

    'googleanalytics' => [
        'ua' =>     env('GOOGLE_ANALYTICS_UA'),
    ],

    'mixpanel' => [
        'token' =>  env('MIXPANEL_TOKEN'),
    ],

    'imgix' => [
      'url' =>  env('IMGIX_SOURCE_URL'),
      'token' =>  env('IMGIX_TOKEN'),
    ],

    'routeone' => [
        'production_url' => 'https://www.routeone.net/XRD/turnKeyOcaStart.do',
        'test_url' => 'https://itl.routeone.net/XRD/turnKeyOcaStart.do',
        'test_mode' => env('ROUTEONE_TEST_MODE', false),
        'id' => 'F00DMR',
    ],

    'slack' => [
        'webhook' => env('SLACK_NOTIFY_URL'),
    ],

];
