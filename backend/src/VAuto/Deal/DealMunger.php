<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Deal;

class DealMunger
{
    /* @var DealPhotosMunger */
    private $photoManager;

    /* @var DealFiltersMunger */
    private $equipmentManager;

    /* @var DealOptionsMunger */
    private $optionsManager;

    public function __construct()
    {
        $this->photoManager = new DealPhotosMunger();
        $this->equipmentManager = new DealFiltersMunger();
        $this->optionsManager = new DealOptionsMunger();
    }

    /**
     * @param Deal $deal
     * @param array $data
     * @param bool $force
     * @return array
     */
    public function import(Deal $deal, array $data, bool $force = false)
    {
        $debug = [];

        // OPTIONS MUST BE RAN BEFORE EQUIPMENT!
        $options_debug = $this->optionsManager->import($deal, $force);
        $equipment_debug = $this->equipmentManager->import($deal, $force);
        $photos_debug = $this->photoManager->import($deal, $data, $force);

        return array_merge($debug, $options_debug, $equipment_debug, $photos_debug);
    }
}
