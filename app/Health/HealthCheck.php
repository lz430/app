<?php

namespace App\Health;

use App\Health\Checks\DataDeliveryCheck;
use App\Health\Checks\FuelCheck;
use App\Health\Checks\JatoCheck;
use App\Health\Checks\TestCheck;
use App\Health\Checks\DatabaseCheck;

class HealthCheck
{
   public function checks()
   {
       $datadelivery = new DataDeliveryCheck();
       $jato = new JatoCheck();
       $fuel = new FuelCheck();
       $database = new DatabaseCheck();
       $test = new TestCheck();


       $checks = [
           'DataDeliveryApi' => $datadelivery->run(),
           'JatoApi' => $jato->run(),
           'FuelApi' => $fuel->run(),
           'Database' => $database->run(),
           'TestCheck' => $test->run(),
       ];

       return $checks;
   }
}