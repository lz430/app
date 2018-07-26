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
            if($result === 'FAIL') {
                $failedTests[] = $result;
            }
        }

        $response = [
            'system-status' => ($failedTests) ? $failedTests : 'OKAY!',
            'services' => [
                $tests
            ]
        ];

        if(in_array('FAIL', $tests, TRUE)) {
            return \Response::json(array(
                $response,
                'code' => 500,
            ), 500);
        } else {
            return \Response::json(array(
                $response,
                'code' => 200,
            ), 200);
        }

    }
}
