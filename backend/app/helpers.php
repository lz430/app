<?php

use Imgix\UrlBuilder;

if (! function_exists('marketing_url')) {
    function marketing_url($path = '')
    {
        if (! starts_with($path, '/')) {
            $path = '/'.$path;
        }

        return config('app.marketing_url').$path;
    }
}

if (! function_exists('generate_asset_url')) {
    function generate_asset_url($url, $size = 'thumbnail')
    {
        $imgixUrl = config('services.imgix.url');
        $imgiToken = config('services.imgix.token');

        $builder = new UrlBuilder($imgixUrl);
        $builder->setSignKey($imgiToken);
        $builder->setUseHttps(true);

        $params = [
            'auto' => 'compress,format',
        ];

        $params['w'] = 800;

        if ($size == 'thumbnail') {
            $params['w'] = 300;
            $params['h'] = 300;
        }

        return $builder->createURL($url, $params);
    }
}

if (! function_exists('hubspot_enabled')) {
    function hubspot_enabled()
    {
        return config('services.hubspot.api_key') ? true : false;
    }
}

if (! function_exists('get_closet_number')) {
    function get_closet_number(array $arr, $search)
    {
        $closest = null;
        foreach ($arr as $item) {
            if ($closest === null || abs($search - $closest) > abs($item - $search)) {
                $closest = $item;
            }
        }

        return $closest;
    }
}
