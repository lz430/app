<?php

namespace App\Health;

use App\Health\Checks\DataDeliveryCheck;
use App\Health\Checks\FuelCheck;
use App\Health\Checks\JatoCheck;
use App\Health\Checks\TestCheck;

class HealthCheck
{
   public function checks()
   {
       $datadelivery = new DataDeliveryCheck();
       $jato = new JatoCheck();
       $fuel = new FuelCheck();
       $test = new TestCheck();

       $checks = [
           'DataDeliveryApi' => $datadelivery->run(),
           'JatoApi' => $jato->run(),
           'FuelApi' => $fuel->run(),
           'TestCheck' => $test->run(),
       ];

       return $checks;
   }
}