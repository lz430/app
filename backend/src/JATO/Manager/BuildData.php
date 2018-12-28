<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use App\Models\JATO\Version;

class BuildData
{

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

        return $this->equipmentOnDeal;
    }
}
