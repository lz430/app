<?php

namespace App\Services\Health\Checks;

use Illuminate\Support\Facades\DB;
use App\Services\Health\HealthCheck;
use GuzzleHttp\Exception\ClientException;

class DatabaseCheck extends HealthCheck
{
    public function run()
    {
        try {
            if (DB::connection()->getPdo()) {
                return 'OKAY!';
            }
        } catch (ClientException $e) {
            print_r($e->getMessage());
        }

        return 'FAIL';
    }
}
