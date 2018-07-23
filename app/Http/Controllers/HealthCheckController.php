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
        foreach($tests as $test) {
            $values[] = $test;
        }

        if(in_array(0, $tests, TRUE)) {
            return view('errors.500', [500]);
        } else {
            return response()->json($tests);
        }
    }
}
