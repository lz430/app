<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Dealer;
use App\Http\Controllers\Controller;
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

        $count = Deal::filterByLocationDistance($zip->latitude, $zip->longitude)->count();

        echo "<br><br>There are $count deals that should return for you.";
    }
}
