<?php

namespace App\Services\Health;

use App\Services\Health\Checks\DataDeliveryCheck;
use App\Services\Health\Checks\FuelCheck;
use App\Services\Health\Checks\JatoCheck;
use App\Services\Health\Checks\TestCheck;
use App\Services\Health\Checks\DatabaseCheck;
use App\Services\Health\Checks\RedisCheck;
use App\Services\Health\Checks\CarletonCheck;
use App\Services\Health\Checks\ElasticCheck;

class HealthCheck
{
   public function checks()
   {
       $datadelivery = new DataDeliveryCheck();
       $jato = new JatoCheck();
       $fuel = new FuelCheck();
       $database = new DatabaseCheck();
       $redis = new RedisCheck();
       $carleton = new CarletonCheck();
       $elastic = new ElasticCheck();

       $checks = [
           'DataDeliveryApi' => $datadelivery->run(),
           'JatoApi' => $jato->run(),
           'FuelApi' => $fuel->run(),
           'CarletonApi' => $carleton->run(),
           'Database' => $database->run(),
           'Redis' => $redis->run(),
           'ElasticSearch' => $elastic->run()
       ];

       return $checks;
   }
}