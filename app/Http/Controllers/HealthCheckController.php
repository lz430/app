<?php

namespace App\Http\Controllers;

use App\Health\HealthCheck;
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

        $hello = [];
        foreach($tests as $title => $result) {
            $hello[] = $result;
            if(in_array($hello, [0])) {
                return response()->view('errors.500', [], 500);
            } else {
                return view('health-checks', ['healthcheck' => $this->health->checks()]);
            }
        }
    }
}
