<?php

namespace App\Health\Checks;
use App\Health\HealthCheck;
use GuzzleHttp\Exception\ClientException;

class TestCheck extends HealthCheck
{
    public function run()
    {
        return false;
    }
}