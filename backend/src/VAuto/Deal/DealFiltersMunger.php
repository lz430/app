<?php

namespace DeliverMyRide\VAuto\Deal;

use Carbon\Carbon;
use App\Models\Deal;
use App\Models\Feature;
use App\Models\Category;
use DeliverMyRide\VAuto\Map;
use App\Models\JATO\Equipment;

class DealFiltersMunger
{
    private $debug;
    private $deal;
    private $version;
    private $option_codes;

    /* @var \Illuminate\Support\Collection */
    private $vauto_features;

    /* @var \Illuminate\Support\Collection */
    private $equipmentOnDeal;

    private $discovered_features;

    /**
     * @param Deal $deal
     * @param bool $force
     * @return array
     */
    public function import(Deal $deal, bool $force = false)
    {
        $this->deal = $deal;
        $this->version = $this->deal->version;

        //
        // Reset importer class
        $this->discovered_features = [];
        $this->vauto_features = [];

        $this->debug = [
            'equipment_feature_count' => 0,
            'equipment_skipped' => 'Yes',
        ];

        // An iffy way to check if we have updated features. we don't
        // do this often, so probably not that big of a deal right now.
        $updatedFeatures = Feature::whereDate('updated_at', '>=', Carbon::now()->subDays(2))->count();

        if ($force || $updatedFeatures) {
            $this->deal->features()->sync([]);
        }

        if ($this->deal->features()->count()) {
            return $this->debug;
        }

        $this->debug['equipment_skipped'] = 'No';

        // Packages, options, and standard equipment already
        // considered and merged together.
        $this->equipmentOnDeal = $deal->getEquipment();

        // If we don't have any equipment something is probably wrong
        if (! $this->equipmentOnDeal->count()) {
            return $this->debug;
        }
        $this->processVautoFeature();

        //
        // Find information for the deal model
        $this->syncSeatingCapacity();

        //
        // Finally get some features.
        // TODO: we don't seem to have any equipment that matches this miscData concept..
        // Not sure where this is coming from.
        $this->buildFeaturesForMiscData();

        // Handles optional and standard equipment
        $this->buildFiltersForEquipmentOnDeal();
        $this->buildFiltersForKnownAttributes();
        $this->buildFiltersForMappedVautoData();
        $this->buildFiltersForColors();

        //
        // Remove conflicting features
        $this->removeConflictingFeatures();

        //
        // Save discovered features to deal.
        $this->updateDealWithDiscoveredFeatures();
        $this->deal->save();

        return $this->debug;
    }

    /**
     * Reduce & Remove conflicting. We do this here in order to persist the
     * original data for debugging purposes.
     *
     * Basically if two schema ids are found we use the one with the greater option id. Which "should"
     * mean that standard equipment that has an option id of zero are overriden by non zero option ids.
     *
     * TODO: I'm not sure we need this anymore, as equipment has been filtered out in advance.
     */
    private function removeConflictingFeatures()
    {
        $reduced = [];

        foreach ($this->discovered_features as $category => $features) {
            foreach ($features as $feature) {
                if (! isset($reduced[$feature->equipment->schema_id])) {
                    $reduced[$feature->equipment->schema_id] = $feature;
                } elseif ($reduced[$feature->equipment->schema_id]->equipment->option_id < $feature->equipment->option_id) {
                    $reduced[$feature->equipment->schema_id] = $feature;
                }
            }
        }

        $this->categorizeDiscoveredFeatures($reduced, true);
    }

    private function updateDealWithDiscoveredFeatures()
    {
        $featureIds = [];
        foreach ($this->discovered_features as $category => $features) {
            $featureIds = array_merge($featureIds, array_keys($features));
        }
        $this->deal->features()->sync($featureIds);
    }

    /**
     * Fancy print Discovered Features.
     */
    public function printDiscoveredFeatures()
    {
        foreach ($this->discovered_features as $category => $features) {
            echo "======= {$category} ======= \n";
            foreach ($features as $feature) {
                echo "  --- {$feature->feature->title} - {$feature->equipment->schema_id} - {$feature->equipment->option_id}\n";
            }
        }
    }

    /**
     * Turn the vauto features into something more useful.
     */
    private function processVautoFeature()
    {
        $vautoFeatures = explode('|', $this->deal->vauto_features);
        $vautoFeatures = array_map('trim', $vautoFeatures);

        $collection = collect($vautoFeatures)
            ->map(function ($item) {
                return trim($item);
            })
            ->map(function ($item) {
                return preg_replace('/[\x00-\x1F\x7F\xA0]/u', '', $item);
            })
            ->filter();

        $this->vauto_features = $collection;
    }

    private function buildFiltersForMappedVautoData()
    {
        $features = $this->vauto_features
            ->map(function ($item) {
                return Feature::withVautoFeature($item)->first();
            })
            ->filter()
            ->unique()
            ->map(function ($feature) {
                return (object) [
                    'feature' => $feature,
                    'equipment' => (object) [
                        'option_id' => 0,
                        'schema_id' => 'VA|'.$feature->title,
                    ],
                ];
            });
        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * @param $features
     * @param bool $reset
     */
    private function categorizeDiscoveredFeatures($features, $reset = false)
    {
        if ($reset) {
            $this->discovered_features = [];
        }

        foreach ($features as $feature) {
            $category = $feature->feature->category->title;
            if (! isset($this->discovered_features[$category])) {
                $this->discovered_features[$category] = [];
            }

            $this->discovered_features[$category][$feature->feature->id] = $feature;
        }
    }

    /**
     * Build features based on option codes.
     */
    public function buildFeaturesForMiscData()
    {
        $features = $this->equipmentOnDeal
            ->reject(function ($equipment) {
                return $equipment->availability != '-';
            })
            ->reject(function ($equipment) {
                return $equipment->optionId !== 0;
            })
            ->map(function ($equipment) {
                return $this->getFeatureFromEquipment($equipment);
            })
            ->filter()
            ->unique();

        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * Build features based on standard equipment.
     */
    private function buildFiltersForEquipmentOnDeal()
    {
        $features = $this->equipmentOnDeal
            ->map(function ($equipment) {
                return $this->getFeatureFromEquipment($equipment);
            })
            ->filter()
            ->unique();

        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * Build from attributes. These are mostly known.
     */
    public function buildFiltersForKnownAttributes()
    {
        //
        // We only search attributes for specific schemaIds.
        // TODO: should we use our new slug concepts instead?
        $parentSchemasIds = [
            59801,  // mobile (android etc)
            1301, // audio system
            17801, // Front seat
        ];

        $features = $this->equipmentOnDeal
            ->reject(function ($equipment) use ($parentSchemasIds) {
                return ! in_array($equipment->schema_id, $parentSchemasIds);
            })
            ->flatMap(function ($equipment) {
                return $equipment->aspects;
            })
            ->reject(function ($attribute) {
                return $attribute->value != 'yes';
            })
            ->map(function ($attribute) {
                $feature = $this->getFeatureFromJatoSchemaId((object) ['schema_id' => $attribute->schemaId]);
                if (! $feature) {
                    return false;
                }

                return (object) [
                    'feature' => $feature,
                    'equipment' => (object) [
                        'option_id' => 0,
                        'schema_id' => $attribute->schemaId,
                    ],
                ];
            })
            ->filter();

        $this->categorizeDiscoveredFeatures($features);
    }

    private function buildFiltersForColors()
    {
        $features = [];
        if (isset(\DeliverMyRide\Fuel\Map::COLOR_MAP[$this->deal->color])) {
            $category = Category::where('slug', '=', 'vehicle_color')->first();
            $color = \DeliverMyRide\Fuel\Map::COLOR_MAP[$this->deal->color];
            $feature = $category->features()->firstOrCreate(
                [
                    'title' => $color,
                ],
                [
                    'is_active' => 1,
                    'slug' => str_slug($color, '-'),
                ]
            );

            $features[] = (object) [
                'feature' => $feature,
                'equipment' => (object) [
                    'option_id' => 0,
                    'schema_id' => 'CU|'.$feature->title,
                ],
            ];
        }

        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * @param Equipment $equipment
     * @return null|\stdClass
     */
    private function getFeatureFromEquipment(Equipment $equipment): ?\stdClass
    {
        $feature = $this->getFeatureFromSlugLookup($equipment);

        if (! $feature) {
            $feature = $this->getFeatureFromJatoSchemaId($equipment);
        }

        if ($feature) {
            return (object) ['feature' => $feature, 'equipment' => $equipment];
        }

        return null;
    }

    /**
     * @param $equipment
     * @return Feature|null
     */
    private function getFeatureFromJatoSchemaId($equipment): ?Feature
    {
        return Feature::withJatoSchemaId($equipment->schema_id)->first();
    }

    /**
     * Given a specific equipment, return a feature or null if no feature was found.
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function getFeatureFromSlugLookup(Equipment $equipment): ?Feature
    {
        $feature = null;

        //
        // Specifically pull out the schema ids we know we care about.
        switch ($equipment->schema_id) {
            case 176:
                $feature = $this->syncVehicleSize($equipment);
                break;
            case 8701:
                $feature = $this->syncFuelType($equipment);
                break;
            case 20601:
                $feature = $this->syncTransmission($equipment);
                break;
            case 6501:
                $feature = $this->syncDriveTrain($equipment);
                break;
            case 17401:
                $feature = $this->syncSeatMaterials($equipment);
                break;
            case 14201:
                $feature = $this->syncPickup($equipment);
                break;
            case 701:
                $feature = $this->syncSeatingConfiguration($equipment);
                break;
            case 5601:
                $feature = $this->syncBackupCamera();
                break;
        }

        if ($feature) {
            return $feature;
        }

        return $feature;
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncVehicleSize(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 176) {
            return null;
        }

        $jatoVehicleSize = $equipment->value;

        if (str_contains(strtolower($jatoVehicleSize), ['luxury', 'near luxury'])) {
            $segment = $this->syncEpaQualifierForSize();
        } else {
            $segment = collect(Map::SIZE_TO_JATO_SIZES)
                ->filter(function ($value) use ($equipment) {
                    // Pull from value instead of availability--per Derek at JATO 2018-02-12
                    return str_contains(strtolower($equipment->value), $value);
                })
                ->keys()
                ->first();
        }
        if (! $segment) {
            return null;
        }

        return Feature::where('slug', $segment)->first();
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncFuelType(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 8701) {
            return null;
        }

        return collect($equipment->aspects)
            ->filter(function ($attribute) {
                return $attribute->name == 'Fuel type';
            })
            ->pluck('value')
            ->map(function ($value) {
                if (str_contains(strtolower($value), ['diesel', 'biodiesel'])) {
                    return 'fuel_type_diesel';
                } elseif (str_contains(strtolower($value), ['hybrid', 'electric'])) {
                    if ($this->syncMildHybridEngineType() == 'mild hybrid') {
                        return 'fuel_type_gas';
                    } else {
                        return 'fuel_type_hybrid_electric';
                    }
                } elseif (str_contains(strtolower($value), ['unleaded', 'unleaded premium', 'premium', 'e85'])) {
                    return 'fuel_type_gas';
                }
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncTransmission(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 20601) {
            return null;
        }

        $attributes = collect($equipment->aspects)->keyBy('name')->all();

        if (isset($attributes['automatic mode - manual']) && $attributes['automatic mode - manual']->value == 'yes') {
            $transmission = 'automatic';
        } elseif (isset($attributes['Transmission type'])) {
            $transmission = $attributes['Transmission type']->value;
        } else {
            return null;
        }

        return Feature::where('slug', 'transmission_'.$transmission)->first();
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncDriveTrain(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 6501) {
            return null;
        }

        return collect($equipment->aspects)
            ->filter(function ($attribute) {
                return $attribute->name == 'Driven wheels';
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', 'drive_train_'.strtolower($slugKey))->first();
            })->first();
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncSeatMaterials(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 17401) {
            return null;
        }

        return collect($equipment->aspects)
            ->filter(function ($attribute) {
                return $attribute->name == 'main seat material';
            })
            ->pluck('value')
            ->map(function ($value) {
                if (str_contains(strtolower($value), ['cloth', 'synthetic suede'])) {
                    return 'seat_main_upholstery_cloth';
                } elseif (str_contains(strtolower($value), ['synthetic leather', 'vinyl'])) {
                    return 'seat_main_upholstery_vinyl';
                } elseif (str_contains(strtolower($value), ['suede'])) {
                    return 'seat_main_upholstery_suede';
                } elseif (str_contains(strtolower($value), ['leather'])) {
                    return 'seat_main_upholstery_leather';
                }
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncSeatingConfiguration(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 701) {
            return null;
        }
        $isPickup = $this->version->body_style === 'Pickup';

        return collect($equipment->aspects)
            ->filter(function ($attribute) {
                return $attribute->name == 'seating configuration';
            })
            ->pluck('value')->map(function ($value) use ($isPickup) {
                if ($isPickup) {
                    if (str_contains(strtolower($value), ['2+0', '3+0'])) {
                        return 'regular_cab';
                    } elseif (str_contains(strtolower($value), ['2+2', '2+3', '3+3'])) {
                        return strtolower($this->version->cab).'_cab';
                    }
                } else {
                    if (str_contains(strtolower($value), ['2+3+3+4'])) {
                        return 'fourth_row_seating';
                    } elseif (str_contains(strtolower($value), ['2+3+2', '2+3+3', '2+2+2', '2+2+3', '2+3+3'])) {
                        return 'third_row_seating';
                    } elseif (str_contains(strtolower($value), ['2+3'])) {
                        return 'second_row_bench';
                    } elseif (str_contains(strtolower($value), ['2+2'])) {
                        return 'second_row_captains_chairs';
                    }
                }
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * @param Equipment $equipment
     * @return Feature|null
     */
    private function syncPickup(Equipment $equipment): ?Feature
    {
        if ($equipment->schema_id !== 14201) {
            return null;
        }

        return collect($equipment->aspects)
            ->filter(function ($attribute) {
                return $attribute->name == 'box length';
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', strtolower($slugKey).'_bed')->first();
            })->first();
    }

    /**
     * Gets the seating capacity from jato equipment for use
     * in filtering actual number of seats in a given car.
     */
    private function syncSeatingCapacity()
    {
        $seatingCategory = $this->equipmentOnDeal
            ->filter(function ($equipment) {
                return $equipment->schema_id == 701;
            })
            ->first();

        if ($seatingCategory && isset($seatingCategory->attributes)) {
            $seatingCapacity = collect($seatingCategory->attributes);

            $capacity = $seatingCapacity
                ->filter(function ($attribute) {
                    return $attribute->name == 'Seating capacity';
                })
                ->pluck('value')
                ->first();
            if ($capacity) {
                $this->deal->seating_capacity = $capacity;
            }
        }
    }

    /**
     * if vehicles sizes returned back from jato are of either luxury or near luxury,
     * have to do a second lookup within the EPA qualifier equipment id to get the size
     * of the car there and then compare to updated list of jato sizes to DMR sizes.
     *
     * @return string
     */
    private function syncEpaQualifierForSize()
    {
        $luxurySizes = $this->equipmentOnDeal
            ->filter(function ($equipment) {
                return $equipment->schema_id == 27601;
            })
            ->first();
        if (! $luxurySizes) {
            return;
        }
        $vehicleSize = collect(Map::LUXURY_SIZE_QUALIFIER)
            ->filter(function ($value) use ($luxurySizes) {
                return str_contains(strtolower($luxurySizes->availability), $value);
            })
            ->keys()
            ->first();

        return $vehicleSize;
    }

    /**
     * looks at the engine type and checks jato to look into the engine hybrid type and if available checks to see
     * if hybrid type == mild hybrid and used when assigning engine types above to make for now gasoline.
     * @return string
     */
    private function syncMildHybridEngineType()
    {
        $engine = $this->equipmentOnDeal
            ->filter(function ($equipment) {
                return $equipment->schema_id == 51801;
            })
            ->first();

        if ($engine && $engine->availability !== 'not available') {
            if ($engine && isset($engine->attributes)) {
                $engineType = collect($engine->attributes);

                return $engineType
                    ->filter(function ($attribute) {
                        return $attribute->name == 'hybrid type';
                    })
                    ->pluck('value')
                    ->first();
            }
        }
    }

    private function syncBackupCamera()
    {
        $parkingSafety = $this->equipmentOnDeal
            ->filter(function ($equipment) {
                return $equipment->schema_id == 5601 && $equipment->location == 'rear';
            })
            ->first();

        if (! $parkingSafety) {
            return;
        }
        if ($parkingSafety && $parkingSafety->availability !== 'not available') {
            if ($parkingSafety && isset($parkingSafety->attributes)) {
                $backupCamera = collect($parkingSafety->attributes);
                $hasParkingSensors = $backupCamera
                    ->filter(function ($attribute) {
                        return $attribute->name == 'type';
                    })
                    ->pluck('value')
                    ->first();

                if ($hasParkingSensors == 'camera & radar') {
                    return Feature::where('slug', 'backup_camera')->first();
                }
            }
        }
    }
}
