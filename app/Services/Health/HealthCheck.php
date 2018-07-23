<?php

namespace App\Services\Health;

use App\Services\Health\Checks\DataDeliveryCheck;
use App\Services\Health\Checks\FuelCheck;
use App\Services\Health\Checks\JatoCheck;
use App\Services\Health\Checks\TestCheck;
use App\Services\Health\Checks\DatabaseCheck;

class HealthCheck
{
   public function checks()
   {
       $datadelivery = new DataDeliveryCheck();
       $jato = new JatoCheck();
       $fuel = new FuelCheck();
       $database = new DatabaseCheck();

       $checks = [
           'DataDeliveryApi' => $datadelivery->run(),
           'JatoApi' => $jato->run(),
           'FuelApi' => $fuel->run(),
           'Database' => $database->run(),
       ];

       return $checks;
   }
}