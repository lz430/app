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

        $values = [];
        foreach($tests as $key => $value) {
            if($value === 0) {
                $values[] = $key;
            }
        }

        if(in_array(0, $tests, TRUE)) {
            return \Response::json(array(
                'code'      =>  500,
                'message'   =>  implode(", ",$values) . " failed!"
            ), 500);
        } else {
            return response()->json($tests);
        }
    }
}
