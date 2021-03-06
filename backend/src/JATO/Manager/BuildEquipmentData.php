<?php

namespace DeliverMyRide\JATO\Manager;

use App\Models\Deal;
use Illuminate\Support\Collection;

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
        'Emission control level',
        'Additional fuel types',
    ];

    private const CATEGORIES_TO_SKIP = [
        'Pricing',
        'General',
    ];

    /* @var \App\Models\Deal */
    private $deal;

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

    private function addItemFactoryFromSingleAttribute(array &$labels,
                                                       array $attributes,
                                                       string $attributeName,
                                                       string $label,
                                                       array $mods = [],
                                                       array $meta = [])
    {
        if (! isset($attributes[$attributeName])) {
            return;
        }

        if (in_array($attributes[$attributeName]->value, ['no', 'none', '-'])) {
            return;
        }

        $attribute = $attributes[$attributeName];

        $value = [];
        if (isset($mods['prefix'])) {
            $value[] = $mods['prefix'];
        }
        if (in_array($attribute->value, ['yes'])) {
            $value[] = 'Included';
        } else {
            $value[] = ucwords($attribute->value);
        }

        if (isset($mods['suffix'])) {
            $value[] = $mods['suffix'];
        }

        $labels[$attribute->schemaId] = $this->itemFactory($label, implode(' ', $value), $meta);
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

        $customMeta = [
            'equipment' => $equipments,
            'from' => 'Custom',
        ];

        switch ($equipments->name) {
            case 'Performance':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'acceleration 0-60 mph',
                    '0-60 mph in',
                    ['suffix' => 'Seconds'],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'maximum speed (mph)',
                    'maximum speed (mph)',
                    [
                        'suffix' => 'MPH',
                    ],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'maximum speed (mph)',
                    'maximum speed (mph)',
                    ['suffix' => 'MPH'],
                    $customMeta
                );

                break;
            case 'Power':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'maximum torque lb ft',
                    'Max Torque LB FT',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'Maximum power hp/PS',
                    'Horsepower',
                    [],
                    $customMeta
                );
                break;
            case 'Fuel system':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'injection/carburetion',
                    'Fuel system',
                    [],
                    $customMeta
                );
                break;
            case 'Speakers':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'brand name',
                    'Sound: Brand',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'number of',
                    'Sound: Number of speakers',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'surround sound',
                    'Sound: Surround Sound',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'subwoofer',
                    'Sound: Subwoofer',
                    [],
                    $customMeta
                );
                break;
            case 'Mobile Integration':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'Apple CarPlay',
                    'Apple CarPlay',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'Android Auto',
                    'Android Auto',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'MirrorLink',
                    'MirrorLink',
                    [],
                    $customMeta
                );
                break;
            case 'External dimensions':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'overall length (in)',
                    'Overall length',
                    ['suffix' => 'In'],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'overall width (in)',
                    'Overall width',
                    ['suffix' => 'In'],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'overall height (in)',
                    'Overall height',
                    ['suffix' => 'In'],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'wheelbase (in)',
                    'Wheelbase',
                    ['suffix' => 'In'],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'curb to curb turning circle (ft)	',
                    'Turning Circle',
                    ['suffix' => 'Feet'],
                    $customMeta
                );
                break;
            case 'Fuel economy':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'urban (mpg)',
                    'City MPG',
                    [],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'country/highway (mpg)',
                    'Highway MPG',
                    [],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'combined (mpg)',
                    'Combined MPG',
                    [],
                    $customMeta
                );

                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'combined vehicle range (miles)',
                    'Estimated range',
                    ['suffix' => 'Miles'],
                    $customMeta
                );

                break;
            case 'Wheels':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'rim diameter (in)',
                    'Rim Size',
                    ['suffix' => 'Inches'],
                    $customMeta
                );
                break;
            case 'Rear view mirror':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'auto-dimming',
                    'Rear view mirror auto-dimming',
                    [],
                    $customMeta
                );
                break;
            case 'Fuel tank':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'capacity (UK gallons)',
                    'Fuel take capacity',
                    ['suffix' => 'Gallons'],
                    $customMeta
                );
                break;

            case 'Luxury trim':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'on shift knob',
                    'Trim: on shift knob',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'on center floor console',
                    'Trim: on center floor console',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'on doors',
                    'Trim: on doors',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'on instrument panel',
                    'Trim: on instrument panel',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'on handbrake grip',
                    'Trim: on handbrake grip',
                    [],
                    $customMeta
                );
                break;

            case 'Drive':
                if (isset($attributes['Driven wheels'])) {
                    $value = [
                        $attributes['Driven wheels']->value,
                    ];

                    if (isset($attributes["manufacturer's name"])) {
                        $value[] = '('.$attributes["manufacturer's name"]->value.')';
                    }
                    $labels[$attributes['Driven wheels']->schemaId] = $this->itemFactory(
                        'Drive',
                        implode(' ', $value),
                        $customMeta);
                }
                break;
            case 'Transmission':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'transmission description',
                    'Transmission description',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'number of speeds',
                    'Number of speeds',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'manufacturer\'s name',
                    'Transmission Name',
                    [],
                    $customMeta
                );
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'gearchange paddles',
                    'Gearchange paddles',
                    [],
                    $customMeta
                );
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
                        $customMeta);
                }
                break;
            case 'Tires':
                if (isset($attributes['type'])) {
                    $labels[$attributes['type']->schemaId] = $this->itemFactory(
                        'Tires',
                        "{$attributes['type']->value}",
                        $customMeta);
                }
                break;
            case 'Engine':
                $liters = isset($attributes['Liters']) ? $attributes['Liters']->value : '';
                $cylinders = isset($attributes['number of cylinders']) ? $attributes['number of cylinders']->value : '';
                $configuration = isset($attributes['configuration']) ? $attributes['configuration']->value : '';
                $labels[$equipments->schema_id] = $this->itemFactory(
                    'Engine',
                    "{$liters} v{$cylinders} {$configuration}",
                    $customMeta);
                break;
            case 'Fuel':
                $this->addItemFactoryFromSingleAttribute(
                    $labels,
                    $attributes,
                    'Fuel type',
                    'Fuel Type',
                    [],
                    $customMeta
                );
                break;
            case 'Cargo area dimensions':
                if (isset($attributes['width between wheelhouses (in)'])) {
                    $this->addItemFactoryFromSingleAttribute(
                        $labels,
                        $attributes,
                        'width between wheelhouses (in)',
                        'Width',
                        [],
                        $customMeta
                    );
                }
                if (isset($attributes['height (in)'])) {
                    $this->addItemFactoryFromSingleAttribute(
                        $labels,
                        $attributes,
                        'height (in)',
                        'Height',
                        [],
                        $customMeta
                    );
                }
                if (isset($attributes['loading floor height (in)'])) {
                    $this->addItemFactoryFromSingleAttribute(
                        $labels,
                        $attributes,
                        'loading floor height (in)',
                        'Loading Floor Height',
                        [],
                        $customMeta
                    );
                }
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
                    if (isset($attributes['type'])) {
                        $value = [ucwords($attributes['type']->value)];
                    } elseif (isset($attributes['distance (miles)']) && isset($attributes['duration (months)'])) {
                        $value = [number_format($attributes['distance (miles)']->value).' (miles) / '.$attributes['duration (months)']->value.' (months)'];
                    } elseif (isset($attributes['distance (miles)']) && isset($attributes['period (mths)'])) {
                        $value = [number_format($attributes['distance (miles)']->value).' (miles) / '.$attributes['period (mths)']->value.' (months)'];
                    } else {
                        $value = ['Included'];
                    }

                    if (isset($attributes["manufacturer's name"])) {
                        $value[] = '('.$attributes["manufacturer's name"]->value.')';
                    }
                    $labels[$equipments->schema_id] = $this->itemFactory(
                        $equipments->name,
                        implode(' ', $value),
                        [
                            'equipment' => $equipments,
                            'from' => 'Equipment Name',
                        ]);
                }
                break;
        }

        return $labels;
    }

    private function labelEquipmentOnDeal($removeDuplicateLabels = true)
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
                        'option_code' => $equipment->option_id,
                    ];

                    if (isset($label['meta'])) {
                        $data['meta'] = $label['meta'];
                    }

                    $labeledEquipment[] = $data;
                }
            }
        }

        if ($removeDuplicateLabels) {
            $labeledEquipment = collect($labeledEquipment)->keyBy('label')->all();
        }

        $this->equipmentOnDeal = array_values($labeledEquipment);
    }

    /**
     * @param Collection $equipment
     * @param Deal $deal
     * @param bool $removeDuplicateLabels
     * @param bool $debug
     * @return mixed
     */
    public function build(Collection $equipment, Deal $deal, bool $removeDuplicateLabels = true, bool $debug = false)
    {
        $this->deal = $deal;
        $this->equipment = $equipment;
        $this->debug = $debug;

        //
        // Include standard Text
        $this->standardEquipmentText = $this->deal->version->standard_text->keyBy('schema_id');

        //
        // Categorize and reduce equipment
        $this->equipment = $equipment
            ->reject(function ($equipment) {
                if (in_array($equipment->category, self::CATEGORIES_TO_SKIP)) {
                    return true;
                }

                if (in_array($equipment->name, self::EQUIPMENT_TO_SKIP)) {
                    return true;
                }

                return false;
            })->groupBy('category', true);

        $this->labelEquipmentOnDeal($removeDuplicateLabels);

        return $this->equipmentOnDeal;
    }
}
