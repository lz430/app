<?php

namespace App\Http\Controllers;

use App\Dealer;
use App\Zipcode;
use Illuminate\Support\Facades\DB;

class ZipCodeTesterController extends Controller
{
    public function __invoke($zipcode)
    {
        $zip = Zipcode::where('zipcode', $zipcode)->firstOrFail();

        echo "Here is a list of dealers we will serve for you:<br><br>";

        Dealer::servesLocation($zip->latitude, $zip->longitude)->get()->each(function ($dealer) use ($zip) {
            $distance = DB::select(DB::raw('SELECT ST_Distance_sphere(
                    point(?, ?),
                    point(?, ?)
                ) * .000621371192 AS distance'), [$dealer->longitude, $dealer->latitude, $zip->longitude, $zip->latitude]);
            $distance = reset($distance)->distance;

            echo "&bull; " . $dealer->name . " ($distance miles)<br>";
        });
    }
}
