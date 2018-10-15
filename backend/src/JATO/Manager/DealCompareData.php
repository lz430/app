<?php

namespace DeliverMyRide\JATO\Manager;


use App\Models\Deal;
use App\Models\Feature;
use DeliverMyRide\JATO\JatoClient;

use GuzzleHttp\Exception\ClientException;

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

    /* @var \DeliverMyRide\JATO\JatoClient */
    private $client;

    /* @var \App\Models\Deal */
    private $deal;

    private $potentialEquipment;
    private $standardEquipmentText;
    private $equipmentOnDeal;

    public function __construct(JatoClient $client, Deal $deal)
    {
        $this->client = $client;
        $this->deal = $deal;
    }


    private function buildPotentialDealEquipment()
    {
        try {
            return $this->client->equipment->get($this->deal->version->jato_vehicle_id)->results;
        } catch (ClientException $e) {
            return [];
        }
    }

    private function buildStandardEquipmentText()
    {
        try {
            return $this->client->standard->get($this->deal->version->jato_vehicle_id, '', '', '1', '50000')->results;
        } catch (ClientException $e) {
            return [];
        }
    }

    private function findStandardDealEquipment()
    {
        return $this->potentialEquipment
            ->reject(function ($equipment) {
                return $equipment->availability !== 'standard';
            })->all();
    }

    private function findOptionalDealEquipment()
    {

        $codes = array_merge(
            $this->deal->package_codes ? $this->deal->package_codes : [],
            $this->deal->option_codes ? $this->deal->option_codes : []
        );

        return $this->potentialEquipment
            ->reject(function ($equipment) {
                return $equipment->availability !== "optional";
            })
            ->reject(function ($equipment) use ($codes) {
                return !in_array($equipment->optionCode, $codes);
            })->all();
    }

    private function compileEquipmentData()
    {
        //
        // Build Equipment
        $equipment = $this->buildPotentialDealEquipment();
        $this->potentialEquipment = collect($equipment);

        //
        // Build standard text
        $text = [];
        foreach ($this->buildStandardEquipmentText() as $item) {
            $text[$item->schemaId] = $item;
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
            $data[$equipment->schemaId] = $equipment;
        }
        $this->equipmentOnDeal = $data;

        //
        // Find optional equipment
        foreach ($this->findOptionalDealEquipment() as $equipment) {
            $this->equipmentOnDeal[$equipment->schemaId] = $equipment;
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

            if (!isset($equipmentCategories[$equipment->category])) {
                $equipmentCategories[$equipment->category] = [];
            }

            $equipmentCategories[$equipment->category][$equipment->schemaId] = $equipment;
        }
        $this->equipmentOnDeal = $equipmentCategories;
    }


    /**
     * @param $equipment
     * @return mixed
     */
    private function getLabelsForJatoEquipment($equipment)
    {
        $labels = [];
        $attributes = [];
        foreach ($equipment->attributes as $attribute) {
            $attributes[$attribute->name] = $attribute;
        }
        switch ($equipment->name) {
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
                    $labels[$attributes['rim diameter (in)']->schemaId] = $attributes['rim diameter (in)']->value . "\" rims";
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
                    $labels[$equipment->schemaId] = "Weight: {$formatted} (lbs)";
                }
                break;
            case 'Tires':
                if (isset($attributes['type'])) {
                    $labels[$attributes['type']->schemaId] = "tires: {$attributes['type']->value}";
                }
                break;
            case 'Engine';
                $labels[$equipment->schemaId] = "{$attributes['Liters']->value} v{$attributes['number of cylinders']->value} {$attributes['configuration']->value}";
                break;
            case 'Fuel';
                $labels[$equipment->schemaId] = "Fuel Type: {$attributes['Fuel type']->value}";
                break;

            default:
                $feature = Feature::withJatoSchemaId($equipment->schemaId)->first();
                if ($feature) {
                    $labels[$equipment->schemaId] = $feature->title;
                } else {
                    if (isset($this->standardEquipmentText[$equipment->schemaId]) && !$equipment->optionId) {
                        if ($this->standardEquipmentText[$equipment->schemaId]->itemName == $this->standardEquipmentText[$equipment->schemaId]->content) {
                            $labels[$equipment->schemaId] = $this->standardEquipmentText[$equipment->schemaId]->content;
                        } else {
                            $labels[$equipment->schemaId] = "{$this->standardEquipmentText[$equipment->schemaId]->itemName}: {$this->standardEquipmentText[$equipment->schemaId]->content}";
                        }
                    } else {
                        $labels[$equipment->schemaId] = $equipment->name;
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
            if (!isset($labeledEquipment[$category])) {
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
