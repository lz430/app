<?php

namespace DeliverMyRide\JATO\Manager;

class BuildOverviewData
{
    /* @var \App\Models\Deal */
    private $equipment;

    /* @var bool */
    private $debug;

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
        if ($equipments->name == 'Power') {
            if (isset($attributes['Maximum power hp/PS'])) {
                $labels[$attributes['Maximum power hp/PS']->schemaId] = $this->itemFactory(
                    'Horse Power',
                    "{$attributes['Maximum power hp/PS']->value}",
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
            }
        }
        if ($equipments->name == 'Transmission') {
            if (isset($attributes['Transmission type'])) {
                $labels[$attributes['Transmission type']->schemaId] = $this->itemFactory(
                    'Transmission Type',
                    "{$attributes['Transmission type']->value}",
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
            }
            if (isset($attributes['number of speeds'])) {
                $labels[$attributes['number of speeds']->schemaId] = $this->itemFactory(
                    'Transmission Speed',
                    "{$attributes['number of speeds']->value}",
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
            }
        }
        if ($equipments->name == 'Fuel economy') {
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
        }
        if ($equipments->name == 'Warranty whole vehicle - Total') {
            $months = isset($attributes['duration (months)']) ? $attributes['duration (months)']->value : '';
            $miles = isset($attributes['distance (miles)']) ? $attributes['distance (miles)']->value : '';
            $labels[$equipments->schemaId] = $this->itemFactory(
                'Warranty',
                "{$months} months / {$miles} miles",
                [
                    'equipment' => $equipments,
                    'from' => 'Custom',
                ]);
        }
        if ($equipments->name == 'Wheels') {
            if (isset($attributes['rim type'])) {
                $labels[$attributes['rim type']->schemaId] = $this->itemFactory(
                    'Rim Type',
                    $attributes['rim type']->value,
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
            }
            if (isset($attributes['rim diameter (in)'])) {
                $labels[$attributes['rim diameter (in)']->schemaId] = $this->itemFactory(
                    'Rim Diameter',
                    $attributes['rim diameter (in)']->value,
                    [
                        'equipment' => $equipments,
                        'from' => 'Custom',
                    ]);
            }
        }

        return $labels;
    }

    private function labelEquipmentOnDeal()
    {
        $labeledEquipment = [];
        foreach ($this->equipment as $category => $equipments) {
            foreach ($equipments as $equipment) {
                $labels = $this->getLabelsForJatoEquipment($equipment);
                if ($labels) {
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
