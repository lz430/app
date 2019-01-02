<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use App\Models\JATO\Version;

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
        $data = Version::with('standard_text')->where('id', $this->deal->version_id)->get();

        return $data;
    }

    private function findStandardDealEquipment()
    {
        $data = Version::with(['equipment' => function ($query) {
            $query->where('availability', 'standard');
        }])->where('id', $this->deal->version_id)->get();

        return $data;
    }

    private function findOptionalDealEquipment()
    {
        $codes = array_merge(
            $this->deal->package_codes ? $this->deal->package_codes : [],
            $this->deal->option_codes ? $this->deal->option_codes : []
        );

        $data = Version::with(['equipment' => function ($query) {
            $query->where('availability', 'optional');
        }])->with(['options' => function ($query) use ($codes) {
            $query->whereIn('option_code', $codes);
        }])->where('id', $this->deal->version_id)->get();

        return $data;
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
            foreach ($equipment->equipment as $equip) {
                $data[$equip->schema_id] = $equip;
            }
        }
        $this->equipmentOnDeal = $data;

        //
        // Find optional equipment
        foreach ($this->findOptionalDealEquipment() as $equipment) {
            foreach ($equipment->equipment as $equip) {
                $this->equipmentOnDeal[$equip->schema_id] = $equip;
            }
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

    private function labelEquipmentOnDeal()
    {
        $labeledEquipment = [];
        foreach ($this->equipment as $category => $equipments) {
            foreach ($equipments as $equipment) {
                $labels = $this->getLabelsForJatoEquipment($equipment);
                foreach ($labels as $schemaId => $label) {
                    $data = [
                        'category' => $category,
                        'label' => $label['label'],
                        'value' => $label['value'],
                    ];

                    if (isset($label['meta'])) {
                        $data['meta'] = $label['meta'];
                    }

                    $labeledEquipment[] = $data;
                }
            }
        }
        $this->equipmentOnDeal = $labeledEquipment;
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
