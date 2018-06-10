<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use App\Models\JATO\Make;
use App\Models\JATO\Manufacturer;
use App\Models\JATO\VehicleModel;
use App\Models\JATO\Version;
use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\Fuel\VersionToFuel;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;


class DealMunger
{

    private $deal;
    private $row;

    private $jatoClient;
    private $fuelClient;

    private $features;

    /**
     * @param Deal $deal
     * @param JatoClient $jatoClient
     * @param FuelClient $fuelClient
     * @param array $features
     * @param array $row
     */
    public function __construct(Deal $deal,
                                JatoClient $jatoClient,
                                FuelClient $fuelClient,
                                array $features,
                                array $row)
    {
        $this->deal;
        $this->jatoClient = $jatoClient;
        $this->fuelClient = $fuelClient;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import()
    {
        $debug = [];

        $equipment_debug = (new DealEquipmentMunger($this->deal, $this->features, $this->jatoClient))->import();
        $photos_debug = (new DealPhotosMunger($this->deal, $this->row, $this->fuelClient))->import();

        return array_merge($debug, $equipment_debug, $photos_debug);

    }


}