<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use DeliverMyRide\Fuel\FuelClient;
use DeliverMyRide\JATO\JatoClient;


class DealMunger
{

    private $deal;
    private $row;

    private $jatoClient;
    private $fuelClient;

    /** @deprecated */
    private $features;

    /**
     * @param Deal $deal
     * @param JatoClient $jatoClient
     * @param FuelClient $fuelClient
     * @param array $row
     */
    public function __construct(Deal $deal,
                                JatoClient $jatoClient,
                                FuelClient $fuelClient,
                                array $row)
    {
        $this->deal = $deal;
        $this->row = $row;
        $this->jatoClient = $jatoClient;
        $this->fuelClient = $fuelClient;
    }

    /**
     * @param bool $force
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import(bool $force = FALSE)
    {
        $debug = [];

        $equipment_debug = (new DealEquipmentMunger($this->deal, $this->jatoClient))->import($force);
        $features_debug = (new DealFeaturesMunger($this->deal, $this->jatoClient))->import($force);
        $photos_debug = (new DealPhotosMunger($this->deal, $this->row, $this->fuelClient))->import($force);

        return array_merge($debug, $equipment_debug, $photos_debug, $features_debug);

    }


}