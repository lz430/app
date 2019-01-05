<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use App\Models\JATO\Option;
use App\Models\JATO\Version;
use App\Models\JATO\Equipment;

class BuildData
{
    private const EQUIPMENT_TO_SKIP = [
        'Internal dimensions',
        'Crash test results',
        'Front seat belts',
        'Rear seat belts',
        'Axle ratio :1',
        'Powertrain type',
        'Bumpers',
        'Exterior door handles',
        'Paint',
        'Rear door',
        'Rear axle',
        'Cargo capacity',
        'Emission control level',
        'Additional fuel types',
    ];

    private const CATEGORIES_TO_SKIP = [
        'Pricing',
        'General',
    ];

    /* @var \App\Models\Deal */
    private $deal;

    /* @var bool */
    private $debug;

    private $standardEquipmentText;
    private $equipmentOnDeal;

    private function buildStandardEquipmentText()
    {
        return Version::with('standard_text')->where('id', $this->deal->version_id)->get();
    }

    private function findStandardDealEquipment()
    {
        return $this->deal->version
            ->equipment()
            ->where('availability', '=', 'standard')
            ->get();
    }

    private function findOptionalDealEquipment()
    {
        $codes = array_merge(
            $this->deal->package_codes ? $this->deal->package_codes : [],
            $this->deal->option_codes ? $this->deal->option_codes : []
        );

        if (! count($codes)) {
            return [];
        }

        $options = Option::whereIn('option_code', $codes)->get()->pluck('option_id');

        if (! count($options)) {
            return [];
        }

        $query = Equipment::query();

        return $query
            ->where('availability', 'optional')
            ->whereIn('option_id', $options)
            ->whereHas('version', function ($query) {
                $query->where('id', '=', $this->deal->version_id);
            })->get();
    }

    private function compileEquipmentData()
    {
        //
        // Build standard text
        $text = [];
        foreach ($this->buildStandardEquipmentText() as $item) {
            foreach ($item->standard_text as $st) {
                $text[$st->schema_id] = $st;
            }
        }
        $this->standardEquipmentText = $text;
    }

    private function dealEquipment()
    {
        //
        // Find standard equipment.
        $data = [];
        $equipments = $this->findStandardDealEquipment();

        foreach ($equipments as $equipment) {
            $data[$equipment->schema_id] = $equipment;
        }
        $this->equipmentOnDeal = $data;

        //
        // Find optional equipment
        foreach ($this->findOptionalDealEquipment() as $equipment) {
            $this->equipmentOnDeal[$equipment->schema_id] = $equipment;
        }
    }

    private function organizeEquipmentOnDeal()
    {
        $equipmentCategories = [];
        foreach ($this->equipmentOnDeal as $equipment) {
            if (in_array($equipment->category, self::CATEGORIES_TO_SKIP)) {
                continue;
            }

            if (in_array($equipment->name, self::EQUIPMENT_TO_SKIP)) {
                continue;
            }

            if (! isset($equipmentCategories[$equipment->category])) {
                $equipmentCategories[$equipment->category] = [];
            }

            $equipmentCategories[$equipment->category][$equipment->schema_id] = $equipment;
        }
        $this->equipmentOnDeal = $equipmentCategories;
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
        $this->compileEquipmentData();
        $this->dealEquipment();
        $this->organizeEquipmentOnDeal();

        return $this->equipmentOnDeal;
    }
}
