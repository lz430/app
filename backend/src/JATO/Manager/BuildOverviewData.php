<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use App\Models\JATO\Version;

class BuildOverviewData
{
    /* @var \App\Models\Deal */
    private $deal;

    /* @var bool */
    private $debug;

    private $equipmentOnDeal;

    private function getHPAttribute()
    {
        $horsepower = Version::with(['equipment' => function ($query) {
            $query->where('category', 'Engine')
                ->where('name', 'Power')
                ->where('availability', 'standard');
        }])->where('id', $this->deal->version_id)->get();

        $powerOnVehicle = [];
        foreach($horsepower as $power){
            foreach($power->equipment as $data){
                $powerOnVehicle['horsepower'] = [
                    'name' => $data->aspects[2]->name,
                    'value' => $data->aspects[2]->value,
                ];
            }
        }

        $this->equipmentOnDeal = $powerOnVehicle;

    }

    private function getTransmissionAttribute()
    {
        $transmission = Version::with(['equipment' => function ($query) {
            $query->where('category', 'Transmission')
                ->where('name', 'Transmission')
                ->where('availability', 'standard');
        }])->where('id', $this->deal->version_id)->get();

        $transmissionOnVehicle = [];
        foreach($transmission as $trans){
            foreach($trans->equipment as $data){
                $transmissionOnVehicle['transmission'] = [
                    'transmission_type' => [
                        'name' => $data->aspects[0]->name,
                        'value' => $data->aspects[0]->value,
                    ],
                    'transmission_speed' => [
                        'name' => $data->aspects[1]->name,
                        'value' => $data->aspects[1]->value,
                    ],
                ];
            }
        }

        $this->equipmentOnDeal = $transmissionOnVehicle;

    }

    /**
     * @param Deal $deal
     * @param bool $debug
     * @return mixed
     */
    public function build(Deal $deal, $debug = false)
    {
        $this->deal = $deal;
        $this->debug = $debug;


        $this->getHPAttribute();
        $this->getTransmissionAttribute();

        return $this->equipmentOnDeal;
    }
}