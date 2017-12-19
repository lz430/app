<?php

if (! function_exists('marketing_url')) {
    function marketing_url($path = '')
    {
        if (! starts_with($path, '/')) {
            $path = '/' . $path;
        }

        return config('app.marketing_url') . $path;
    }
}
