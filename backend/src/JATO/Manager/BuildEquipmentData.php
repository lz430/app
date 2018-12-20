<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use App\Models\JATO\Version;

class BuildEquipmentData
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

    private function itemFactory($label, $value, $meta = [])
    {
        $emptyItem = [
            'label' => $label,
            'value' => $value,
        ];

        if ($this->debug) {
            $emptyItem['meta'] = $meta;
        }

        return $emptyItem;
    }

    /**
     * @param $equipments
     * @return mixed
     */
    private function getLabelsForJatoEquipment($equipments)
    {
        $labels = [];
        $attributes = [];

        foreach ($equipments->aspects as $attribute) {
            $attributes[$attribute->name] = $attribute;
        }
        switch ($equipments->name) {
            case 'External dimensions':
                if (isset($attributes['overall length (in)'])) {
                    $overallLength = isset($attributes['overall length (in)']) ? $attributes['overall length (in)']->value : '';
                    $overallWidth = isset($attributes['overall width (in)']) ? $attributes['overall width (in)']->value : '';
                    $overallHeight = isset($attributes['overall height (in)']) ? $attributes['overall height (in)']->value : '';
                    $labels[$attributes['overall length (in)']->schemaId] = $this->itemFactory(
                        'External',
                        "L: {$overallLength}\" - W: {$overallWidth}\" - H: {$overallHeight}\"",
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }
                break;
            case 'Fuel economy':
                if (isset($attributes['urban (mpg)'])) {
                    $labels[$attributes['urban (mpg)']->schemaId] = $this->itemFactory(
                        'City MPG',
                        $attributes['urban (mpg)']->value,
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }

                if (isset($attributes['country/highway (mpg)'])) {
                    $labels[$attributes['country/highway (mpg)']->schemaId] = $this->itemFactory(
                        'Highway MPG',
                        $attributes['country/highway (mpg)']->value,
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }

                break;
            case 'Wheels':
                if (isset($attributes['rim diameter (in)'])) {
                    $labels[$attributes['rim diameter (in)']->schemaId] = $this->itemFactory(
                        'Rim Size',
                        $attributes['rim diameter (in)']->value,
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }
                break;
            case 'Drive':
                if (isset($attributes['Driven wheels'])) {
                    $labels[$attributes['Driven wheels']->schemaId] = $this->itemFactory(
                        'Drive',
                        $attributes['Driven wheels']->value,
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }
                break;
            case 'Transmission':
                if (isset($attributes['Transmission type'])) {
                    $speeds = isset($attributes['number of speeds']) ? $attributes['number of speeds']->value : '';
                    $labels[$attributes['Transmission type']->schemaId] = $this->itemFactory(
                        'Transmission',
                        "{$speeds} speed {$attributes['Transmission type']->value}",
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
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
                    $labels[$equipments->schema_id] = $this->itemFactory(
                        'Weight',
                        "{$formatted} (lbs)",
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }
                break;
            case 'Tires':
                if (isset($attributes['type'])) {
                    $labels[$attributes['type']->schemaId] = $this->itemFactory(
                        'Tires',
                        "{$attributes['type']->value}",
                        [
                            'equipment' => $equipments,
                            'from' => 'Custom',
                        ]);
                }
                break;
            case 'Engine':
                $liters = isset($attributes['Liters']) ? $attributes['Liters']->value : '';
                $cylinders = isset($attributes['number of cylinders']) ? $attributes['number of cylinders']->value : '';
                $configuration = isset($attributes['configuration']) ? $attributes['configuration']->value : '';
                $labels[$equipments->schema_id] = $this->itemFactory(
                    'Engine',
                    "{$liters} v{$cylinders} {$configuration}",
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
                break;
            case 'Fuel':
                $labels[$equipments->schema_id] = $this->itemFactory(
                    'Fuel Type',
                    "{$attributes['Fuel type']->value}",
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
                break;
                break;
            default:
                if (isset($this->standardEquipmentText[$equipments->schema_id]) && ! $equipments->option_id) {
                    if ($this->standardEquipmentText[$equipments->schema_id]->item_name == $this->standardEquipmentText[$equipments->schema_id]->content) {
                        $labels[$equipments->schema_id] = $this->standardEquipmentText[$equipments->schema_id]->content;
                        $labels[$equipments->schema_id] = $this->itemFactory(
                            'Label',
                            $this->standardEquipmentText[$equipments->schema_id]->content,
                            [
                                'equipment' => $equipments,
                                'from' => 'Standard Text Content',
                            ]);
                    } else {
                        $labels[$equipments->schema_id] = $this->itemFactory(
                            $this->standardEquipmentText[$equipments->schema_id]->item_name,
                            "{$this->standardEquipmentText[$equipments->schema_id]->content}",
                            [
                                'equipment' => $equipments,
                                'from' => 'Standard Text Item & Content',
                            ]);
                    }
                } else {
                    $labels[$equipments->schema_id] = $this->itemFactory(
                        'Label',
                        $equipments->name,
                        [
                            'equipment' => $equipments,
                            'from' => 'Equipment Name',
                        ]);
                }
                break;

        }

        return $labels;
    }

    private function labelEquipmentOnDeal()
    {
        $labeledEquipment = [];
        foreach ($this->equipmentOnDeal as $category => $equipments) {
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
        $this->labelEquipmentOnDeal();

        return $this->equipmentOnDeal;
    }
}
