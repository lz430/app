<?php

namespace DeliverMyRide\JATO\Manager;

class BuildEquipmentData
{
    /* @var \App\Models\Deal */
    private $equipment;

    /* @var bool */
    private $debug;

    private $standardEquipmentText;
    private $equipmentOnDeal;

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
            default:
                //
                // If the equipment isn't optional, and we have standard text.
                if (isset($this->standardEquipmentText[$equipments->schema_id]) && ! $equipments->option_id) {
                    if ($this->standardEquipmentText[$equipments->schema_id]->item_name == $this->standardEquipmentText[$equipments->schema_id]->content) {
                        $labels[$equipments->schema_id] = $this->itemFactory(
                            $this->standardEquipmentText[$equipments->schema_id]->content,
                            'Included',
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
                        $equipments->name,
                        'Included',
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
     * @param array $equipment
     * @param bool $debug
     * @return mixed
     */
    public function build($equipment = [], $debug = false)
    {

        $this->equipment = $equipment;
        $this->debug = $debug;

        $this->labelEquipmentOnDeal();

        return $this->equipmentOnDeal;
    }
}
