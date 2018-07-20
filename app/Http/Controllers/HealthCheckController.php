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

        return view('health-checks', ['healthcheck' => $tests]);
    }
}
