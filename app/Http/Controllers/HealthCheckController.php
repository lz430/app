<?php

namespace App\Http\Controllers;

use App\Services\Health\HealthCheck;
use GuzzleHttp\Exception\ClientException;

class HealthCheckController extends Controller
{
    protected $health;

    public function __construct(HealthCheck $health) {
        $this->health = $health;
    }

    public function index()
    {
        $tests = $this->health->checks();

        $failedTests = [];
        foreach($tests as $name => $result) {
            if($result === 0) {
                $failedTests[] = $name;
            }
        }

        if(in_array(0, $tests, TRUE)) {
            return \Response::json(array(
                'code'      =>  500,
                'message'   =>  implode(", ",$failedTests) . " failed!"
            ), 500);
        } else {
            return response()->json($tests);
        }
    }
}
