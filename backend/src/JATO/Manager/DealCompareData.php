<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use App\Models\Feature;
use App\Models\JATO\Version;

class DealCompareData
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

    private $standardEquipmentText;
    private $equipmentOnDeal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

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
        // Build Equipment
        /*$equipment = $this->buildPotentialDealEquipment();
        $this->potentialEquipment = collect($equipment);*/

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

    /**
     * @param $equipment
     * @return mixed
     */
    private function getLabelsForJatoEquipment($equipments)
    {
        $labels = [];
        $attributes = [];

        foreach ($equipments->attributes as $attribute) {
            $attributes[$attribute->name] = $attribute;
        }
        switch ($equipments->name) {
            case 'External dimensions':
                if (isset($attributes['overall length (in)'])) {
                    $overallLength = isset($attributes['overall length (in)']) ? $attributes['overall length (in)']->value : '';
                    $overallWidth = isset($attributes['overall width (in)']) ? $attributes['overall width (in)']->value : '';
                    $overallHeight = isset($attributes['overall height (in)']) ? $attributes['overall height (in)']->value : '';
                    $labels[$attributes['overall length (in)']->schemaId] = "External: L: {$overallLength}\" - W: {$overallWidth}\" - H: {$overallHeight}\"";
                }
                break;
            case 'Fuel economy':
                if (isset($attributes['urban (mpg)'])) {
                    $labels[$attributes['urban (mpg)']->schemaId] = "{$attributes['urban (mpg)']->value} / {$attributes['country/highway (mpg)']->value}";
                }
                break;
            case 'Wheels':
                if (isset($attributes['rim diameter (in)'])) {
                    $labels[$attributes['rim diameter (in)']->schemaId] = $attributes['rim diameter (in)']->value.'" rims';
                }
                break;
            case 'Drive':
                if (isset($attributes['Driven wheels'])) {
                    $labels[$attributes['Driven wheels']->schemaId] = $attributes['Driven wheels']->value;
                }
                break;
            case 'Transmission':
                if (isset($attributes['Transmission type'])) {
                    $labels[$attributes['Transmission type']->schemaId] = "{$attributes['number of speeds']->value} speed {$attributes['Transmission type']->value}";
                }
                break;
            case 'Weights':
                if (isset($attributes['gross vehicle weight (lbs)'])) {
                    $val = $attributes['gross vehicle weight (lbs)'];
                } elseif (isset($attributes['published curb weight (lbs)'])) {
                    $val = $attributes['published curb weight (lbs)'];
                }
                if (isset($val)) {
                    $formatted = number_format($val->value);
                    $labels[$equipments->schema_id] = "Weight: {$formatted} (lbs)";
                }
                break;
            case 'Tires':
                if (isset($attributes['type'])) {
                    $labels[$attributes['type']->schemaId] = "tires: {$attributes['type']->value}";
                }
                break;
            case 'Engine':
                $labels[$equipments->schema_id] = "{$attributes['Liters']->value} v{$attributes['number of cylinders']->value} {$attributes['configuration']->value}";
                break;
            case 'Fuel':
                $labels[$equipments->schema_id] = "Fuel Type: {$attributes['Fuel type']->value}";
                break;

            default:
                $feature = Feature::withJatoSchemaId($equipments->schema_id)->first();
                if ($feature) {
                    $labels[$equipments->schema_id] = $feature->title;
                } else {
                    if (isset($this->standardEquipmentText[$equipments->schema_id]) && ! $equipments->option_id) {
                        if ($this->standardEquipmentText[$equipments->schema_id]->item_name == $this->standardEquipmentText[$equipments->schema_id]->content) {
                            $labels[$equipments->schema_id] = $this->standardEquipmentText[$equipments->schema_id]->content;
                        } else {
                            $labels[$equipments->schema_id] = "{$this->standardEquipmentText[$equipments->schema_id]->item_name}: {$this->standardEquipmentText[$equipments->schema_id]->content}";
                        }
                    } else {
                        $labels[$equipments->schema_id] = $equipments->name;
                    }
                }
                break;

        }

        return $labels;
    }

    private function labelEquipmentOnDeal()
    {
        $labeledEquipment = [];

        foreach ($this->equipmentOnDeal as $category => $equipments) {
            if (! isset($labeledEquipment[$category])) {
                $labeledEquipment[$category] = [];
            }

            foreach ($equipments as $equipment) {
                $labels = $this->getLabelsForJatoEquipment($equipment);

                foreach ($labels as $schemaId => $label) {
                    $labeledEquipment[$category][$schemaId] = $label;
                }
            }
        }
        $this->equipmentOnDeal = $labeledEquipment;
    }

    public function build()
    {
        $this->compileEquipmentData();
        $this->dealEquipment();
        $this->organizeEquipmentOnDeal();
        $this->labelEquipmentOnDeal();

        return $this->equipmentOnDeal;
    }
}
