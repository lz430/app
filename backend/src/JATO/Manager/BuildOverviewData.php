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

    private const DRIVE_TRAIN_MAP = [
        '4WD' => 'Four Wheel Drive (4x4)',
        'AWD' => 'All Wheel Drive (AWD)',
        'FWD' => 'Front Wheel Drive (FWD)',
        'RWD' => 'Rear Wheel Drive (RWD)',
    ];

    private const FUEL_TYPE_MAP = [
        'unleaded' => 'Unleaded Gas',
        'premium unleaded' => 'Premium Unleaded Gas',
        'electric' => 'Electric',
        'diesel' => 'Diesel',
        'E85' => 'E85',
        'compressed natural gas' => 'Compressed Natural Gas',
    ];

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
                    if($horsePower != '') { // super hacky TODO:fix this
                        $labeledEquipment[] = [
                            'category' => 'Power',
                            'label' => "{$liters}L {$valves}{$configuration}",
                            'value' => "{$horsePower} hp",
                        ];
                    }
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
                    $type = isset($attributes['Transmission type']) ? ucwords($attributes['Transmission type']->value) : '';
                    $speeds = isset($attributes['number of speeds']) ? $attributes['number of speeds']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Transmission',
                        'label' => "{$type} Transmission",
                        'value' => "{$speeds}-Speed",
                    ];
                }
                if ($equipment->name == 'Head restraints') {
                    if(isset($attributes['location']) && $attributes['location']->value == 'front seats') {
                        $capacity = isset($dealData->seating_capacity) ? $dealData->seating_capacity : '';
                        $labeledEquipment[] = [
                            'category' => 'Seating',
                            'label' => 'Seating Capacity',
                            'value' => "Up to {$capacity}",
                        ];
                    }
                }
                // Data for overview section
                if ($equipment->name == 'Paint') {
                    $exteriorColor = ucwords($dealData->simpleExteriorColor());
                    $labeledEquipment[] = [
                        'category' => 'Exterior',
                        'label' => 'Exterior Color',
                        'value' => "{$exteriorColor} Exterior",
                    ];
                    $labeledEquipment[] = [
                        'category' => 'Interior',
                        'label' => 'Interior Color',
                        'value' => "{$dealData->interior_color} Interior",
                    ];
                }
                if ($equipment->name == 'Seat upholstery') {
                    $material = isset($attributes['main seat material']) ? ucwords($attributes['main seat material']->value) : '';
                    $labeledEquipment[] = [
                        'category' => 'Seat upholstery',
                        'label' => 'Seat Material',
                        'value' => "{$material} Seats",
                    ];
                    $bodyStyle = isset($dealData->version->body_style) ? ucwords($dealData->version->body_style) : '';
                    $labeledEquipment[] = [
                        'category' => 'Body style',
                        'label' => 'Body Style',
                        'value' => "{$bodyStyle}",
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
                if ($equipment->name == 'Drive') {
                    $driveTrain = isset($attributes['Driven wheels']) ? self::DRIVE_TRAIN_MAP[$attributes['Driven wheels']->value] : '';
                    $labeledEquipment[] = [
                        'category' => 'Drive',
                        'label' => 'Drive Train',
                        'value' => "{$driveTrain}",
                    ];
                }
                if ($equipment->name == 'Wheels') {
                    if (isset($attributes['location']) && $attributes['location']->value == 'front') {
                        $rimType = isset($attributes['rim type']) ? ucwords($attributes['rim type']->value) : '';
                        $rimSize = isset($attributes['rim diameter (in)']) ? $attributes['rim diameter (in)']->value . '"' : '';
                        $labeledEquipment[] = [
                            'category' => 'Wheels',
                            'label' => 'Wheels',
                            'value' => "{$rimSize} {$rimType} Wheels",
                        ];
                    }
                }
                if ($equipment->name == 'Fuel') {
                    $fuel = isset($attributes['Fuel type']) ? self::FUEL_TYPE_MAP[$attributes['Fuel type']->value] : '';
                    $labeledEquipment[] = [
                        'category' => 'Fuel',
                        'label' => 'Fuel Type',
                        'value' => "{$fuel}",
                    ];
                }
                if ($equipment->name == 'Warranty whole vehicle - Total') {
                    $months = isset($attributes['duration (months)']) ? $attributes['duration (months)']->value : '';
                    $miles = isset($attributes['distance (miles)']) ? $attributes['distance (miles)']->value : '';
                    $labeledEquipment[] = [
                        'category' => 'Warranty',
                        'label' => 'Vehicle Warranty',
                        'value' => "{$months} Months / {$miles} Miles Warranty",
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
            ->whereIn('name', ['Warranty whole vehicle - Total', 'Wheels', 'Seat upholstery', 'Fuel', 'Drive', 'Paint'])
            ->groupBy('name', true);

        $this->labelEquipmentOnDeal($this->deal);

        return $this->equipmentOnDeal;
    }

    public function getHighlightsData(Collection $equipment, Deal $deal)
    {
        $this->deal = $deal;

        /**
         * Rather hacky but chose an arbitrary equipment name to represent seating capacity since the
         * actual Seating category name is not pulled since the availability is '-' for some vehicles instead of
         * standard/optional so just used to show the data for the highlights seating data, which is pulled from
         * the deals table instead of pulling from JATO
         **/
        $this->equipment = $equipment
            ->whereIn('name', ['Power', 'Engine', 'Fuel economy', 'Transmission', 'Head restraints'])
            ->groupBy('name', true);

        $this->labelEquipmentOnDeal($this->deal);

        return $this->equipmentOnDeal;
    }
}
