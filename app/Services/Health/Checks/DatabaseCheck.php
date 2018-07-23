<?php

namespace App\Services\Health\Checks;
use App\Services\Health\HealthCheck;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Exception\ClientException;

class DatabaseCheck extends HealthCheck {

    public function run()
    {
        try {
            if (DB::connection()->getPdo()) {
                return true;
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 0;
    }
}

