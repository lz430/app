<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use Illuminate\Support\Collection;

class BuildOverviewData
{
    /* @var \App\Models\Deal */
    private $equipment;

    /* @var \App\Models\Deal */
    private $deal;

    private $equipmentOnDeal;

    private function labelEquipmentOnDeal($dealData)
    {
        $labeledEquipment = [];
        $attributes = [];
        foreach ($this->equipment as $category => $equipments) {
            foreach ($equipments as $equipment) {
                foreach ($equipment->aspects as $attribute) {
                    $attributes[$attribute->name] = $attribute;
                }
                // Data for highlights section
                if (in_array($equipment->name, ['Engine', 'Power'])) {
                    $liters = isset($attributes['Liters']) ? $attributes['Liters']->value : '';
                    $configuration = isset($attributes['configuration']) ? $attributes['configuration']->value : '';
                    $valves = isset($attributes['number of valves per cylinder']) ? $attributes['number of valves per cylinder']->value : '';
                    $horsePower = isset($attributes['Maximum power hp/PS']) ? $attributes['Maximum power hp/PS']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Power',
                        'label' => "{$liters}L v{$valves}{$configuration}",
                        'value' => "{$horsePower} hp",
                    ];
                }
                if ($equipment->name == 'Fuel economy') {
                    $city = isset($attributes['urban (mpg)']) ? $attributes['urban (mpg)']->value : '';
                    $highway = isset($attributes['country/highway (mpg)']) ? $attributes['country/highway (mpg)']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Fuel economy',
                        'label' => 'city MPG hwy',
                        'value' => "{$city} | {$highway}",
                    ];
                }
                if ($equipment->name == 'Transmission') {
                    $type = isset($attributes['Transmission type']) ? $attributes['Transmission type']->value : '';
                    $speeds = isset($attributes['number of speeds']) ? $attributes['number of speeds']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Transmission',
                        'label' => "{$type} transmission",
                        'value' => "{$speeds}-speed",
                    ];
                }
                if ($equipment->name == 'Seating') {
                    $capacity = isset($attributes['Seating capacity']) ? $attributes['Seating capacity']->value : '';
                    $capacity = $capacity - 1;
                    $labeledEquipment[] = [
                        'category' => 'Seating',
                        'label' => 'Passengers',
                        'value' => "Up to {$capacity}",
                    ];
                }
                // Data for overview section
                if ($equipment->name == 'Warranty whole vehicle - Total') {
                    $months = isset($attributes['duration (months)']) ? $attributes['duration (months)']->value : '';
                    $miles = isset($attributes['distance (miles)']) ? $attributes['distance (miles)']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Warranty',
                        'label' => 'Vehicle Warranty',
                        'value' => "{$months} months / {$miles} miles warranty",
                    ];
                }
                if ($equipment->name == 'Wheels') {
                    if (isset($attributes['location']) && $attributes['location']->value == 'front') {
                        $rimType = isset($attributes['rim type']) ? $attributes['rim type']->value : '';
                        $rimSize = isset($attributes['rim diameter (in)']) ? $attributes['rim diameter (in)']->value : '';
                        $labeledEquipment[] = [
                            'category' => 'Wheels',
                            'label' => 'Wheels',
                            'value' => "{$rimSize} {$rimType} wheels",
                        ];
                    }
                }
                if ($equipment->name == 'Seat upholstery') {
                    $material = isset($attributes['main seat material']) ? $attributes['main seat material']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Seat upholstery',
                        'label' => 'Seat Material',
                        'value' => "{$material} seats",
                    ];
                    $labeledEquipment[] = [
                        'category' => 'Interior',
                        'label' => 'Interior Color',
                        'value' => "{$dealData->interior_color} Interior",
                    ];
                }
                if ($equipment->name == 'Body style') {
                    $bodyStyle = isset($attributes['Body type']) ? $attributes['Body type']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Body style',
                        'label' => 'Body Style',
                        'value' => "{$bodyStyle}",
                    ];
                }
                if ($equipment->name == 'Fuel') {
                    $fuel = isset($attributes['Fuel type']) ? $attributes['Fuel type']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Fuel',
                        'label' => 'Fuel Type',
                        'value' => "{$fuel}",
                    ];
                }
                if ($equipment->name == 'Drive') {
                    $driveTrain = isset($attributes['Driven wheels']) ? $attributes['Driven wheels']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Drive',
                        'label' => 'Drive Train',
                        'value' => "{$driveTrain}",
                    ];
                }
                if ($equipment->name == 'Paint') {
                    $labeledEquipment[] = [
                        'category' => 'Exterior',
                        'label' => 'Exterior Color',
                        'value' => "{$dealData->simpleExteriorColor()} Exterior",
                    ];
                }
            }
        }

        $this->equipmentOnDeal = $labeledEquipment;
    }

    public function getOverviewData(Collection $equipment, Deal $deal)
    {
        $this->deal = $deal;

        $this->equipment = $equipment
            ->whereIn('name', ['Warranty whole vehicle - Total', 'Wheels', 'Seat upholstery', 'Body style', 'Fuel', 'Drive', 'Paint'])
            ->groupBy('name', true);
        $this->labelEquipmentOnDeal($this->deal);

        return $this->equipmentOnDeal;
    }

    public function getHighlightsData(Collection $equipment, Deal $deal)
    {
        $this->deal = $deal;

        $this->equipment = $equipment
            ->whereIn('name', ['Power', 'Engine', 'Fuel economy', 'Transmission', 'Seating'])
            ->groupBy('name', true);

        $this->labelEquipmentOnDeal($this->deal);

        return $this->equipmentOnDeal;
    }
}
