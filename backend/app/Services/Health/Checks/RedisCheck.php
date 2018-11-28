<?php

namespace App\Services\Health\Checks;

use App\Services\Health\HealthCheck;
use Illuminate\Support\Facades\Redis;
use GuzzleHttp\Exception\ClientException;

class RedisCheck extends HealthCheck
{
    public function run()
    {
        try {
            if (Redis::connection()->ping()) {
                return 'OKAY!';
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 'FAIL';
    }
}
