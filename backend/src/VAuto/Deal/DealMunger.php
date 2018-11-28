<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;

class DealMunger
{
    private $jatoClient;

    /* @var \DeliverMyRide\VAuto\Deal\DealPhotosMunger */
    private $photoManager;

    /* @var \DeliverMyRide\VAuto\Deal\DealEquipmentMunger */
    private $equipmentManager;

    /* @var \DeliverMyRide\VAuto\Deal\DealFeaturesMunger */
    private $featuresManager;

    /**
     * @param JatoClient $jatoClient
     */
    public function __construct(JatoClient $jatoClient)
    {
        $this->jatoClient = $jatoClient;
        $this->photoManager = new DealPhotosMunger();
        $this->equipmentManager = new DealEquipmentMunger($this->jatoClient);
        $this->featuresManager = new DealFeaturesMunger($this->jatoClient);
    }

    /**
     * @param Deal $deal
     * @param array $data
     * @param bool $force
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import(Deal $deal, array $data, bool $force = false)
    {
        $debug = [];

        $equipment_debug = $this->equipmentManager->import($deal, $force);
        $features_debug = $this->featuresManager->import($deal, $force);
        $photos_debug = $this->photoManager->import($deal, $data, $force);

        return array_merge($debug, $equipment_debug, $photos_debug, $features_debug);
    }
}
