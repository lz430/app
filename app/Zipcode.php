<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Zipcode extends Model
{
    public $timestamps = false;
    protected $guarded = ['id'];

    public static function isSupported($code)
    {
        return Cache::remember('zip-code:' . $code, 1440, function () use ($code) {
            $zipCode = self::where('zipcode', $code)->first();

            if ($zipCode) {
                return Dealer::servesLocation($zipCode->latitude, $zipCode->longitude)->count() > 0;
            }

            return false;
        });
    }
}
