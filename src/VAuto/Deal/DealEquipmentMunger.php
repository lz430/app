<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Feature;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use PhpParser\Node\Expr\Cast\Object_;

/**
 *
 */
class DealEquipmentMunger
{
    private $debug;
    private $client;
    private $deal;
    private $version;
    private $option_codes;

    /* @var \Illuminate\Support\Collection */
    private $features;

    /* @var \Illuminate\Support\Collection */
    private $equipment;

    /* @var \Illuminate\Support\Collection */
    private $packages;

    /* @var \Illuminate\Support\Collection */
    private $options;

    private $discovered_features;

    /**
     * @param Deal $deal
     * @param JatoClient $client
     */
    public function __construct(Deal $deal, JatoClient $client)
    {

        $this->deal = $deal;
        $this->client = $client;
        $this->version = $this->deal->version;
        $this->features = Feature::with('category')->get();
        $this->discovered_features = [];

        $this->debug = [
            'equipment_extracted_codes' => [],
            'equipment_feature_count' => 0,
        ];
    }

    /**
     * @param bool $force
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import(bool $force = FALSE)
    {
        if ($force) {
            $this->deal->features()->sync([]);
        }

        if ($this->deal->features()->count()) {
            return $this->debug;
        }

        //
        // Get get data sources
        $this->initializeData();

        //
        // Do some additional transformation
        $this->extractAdditionalOptionCodes();
        $this->initializeOptionCodes();

        //
        // Finally get some features.
        $this->buildFeaturesForMiscData();
        $this->buildFeaturesForStandardEquipment();
        $this->buildFeaturesForOptionCodes();

        $this->buildFeaturesForKnownAttributes();

        //$this->buildFeaturesFromGuessedVautoNames();



        $this->equipmentDebugger();

        //
        // Remove conflicting features
        $this->removeConflictingFeatures();

        //
        // Save discovered features to deal.
        $this->updateDealWithDiscoveredFeatures();

        return $this->debug;
    }

    /**
     * Reduce & Remove conflicting. We do this here in order to persist the
     * original data for debugging purposes.
     *
     * Basically if two schema ids are found we use the one with the greater option id. Which "should"
     * mean that standard equipment that has an option id of zero are overriden by non zero option ids.
     */
    private function removeConflictingFeatures()
    {
        $reduced = [];

        foreach ($this->discovered_features as $category => $features) {
            foreach($features as $feature) {
                if (!isset($reduced[$feature->equipment->schemaId])) {
                    $reduced[$feature->equipment->schemaId] = $feature;
                }
                elseif ($reduced[$feature->equipment->schemaId]->equipment->optionId < $feature->equipment->optionId) {
                    $reduced[$feature->equipment->schemaId] = $feature;
                }
            }
        }

        $this->categorizeDiscoveredFeatures($reduced, true);
    }

    /**
     *
     */
    private function updateDealWithDiscoveredFeatures()
    {
        $featureIds = [];
        foreach ($this->discovered_features as $category => $features) {
            $featureIds = array_merge($featureIds, array_keys($features));
        }
        $this->deal->features()->sync($featureIds);
    }

    /**
     * Fancy print Discovered Features
     */
    public function printDiscoveredFeatures()
    {
        foreach ($this->discovered_features as $category => $features) {
            print "======= {$category} ======= \n";
            foreach ($features as $feature) {
                print "  --- {$feature->feature->title} - {$feature->equipment->schemaId} - {$feature->equipment->optionId}\n";
            }
        }
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function initializeData()
    {
        $this->equipment = $this->fetchVersionEquipment();
        $this->packages = $this->fetchVersionPackages();
        $this->options = $this->fetchVersionOptions();
    }

    public function initializeOptionCodes($override = [])
    {
        if (count($override)) {
            $this->option_codes = $override;
        } else {
            $this->option_codes = $this->deal->option_codes;
        }
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionEquipment(): \Illuminate\Support\Collection
    {
        return collect($this->client->equipment->get($this->version->jato_vehicle_id)->results);
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionPackages(): \Illuminate\Support\Collection
    {
        return collect($this->client->option->get($this->version->jato_vehicle_id, 'P')->options);
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionOptions(): \Illuminate\Support\Collection
    {
        return collect($this->client->option->get($this->version->jato_vehicle_id, 'O')->options);
    }

    /**
     * Attempts to extract additional option codes for a given deal by checking how similar
     * a vauto feature is to a known jato optional equipment. if a feature is pretty close we assume
     * it's an option code the deal has and attach it to the vehicle.
     *
     * TODO errors:
     *  - Alloy Seats vs Black Seats returns "4"
     */
    public function extractAdditionalOptionCodes()
    {
        $option_codes = $original_options = $this->deal->option_codes;

        // TODO: Probably some smarter way to do this.
        $options = $this->options
            ->map(function ($option) {
                return [$option->optionName, $option->optionCode];
            })->toArray();

        $all_version_optional = [];
        foreach ($options as $option) {
            $all_version_optional[$option[1]] = $option[0];
        }

        $features = explode("|", $this->deal->vauto_features);
        $features = array_map('trim', $features);

        $additional_option_codes = [];

        foreach ($features as $feature) {
            foreach ($all_version_optional as $code => $optional) {
                $score = levenshtein($optional, $feature);
                if ($score < 5) {
                    $this->debug['equipment_extracted_codes'][] = [
                        'Option Code' => $code,
                        'Option Title' => $optional,
                        'Feature' => $feature,
                        'Score' => $score,
                    ];
                    $additional_option_codes[] = $code;
                }
            }
        }
        $found_option_codes = $additional_option_codes;

        $additional_option_codes = array_diff($additional_option_codes, $original_options);
        $option_codes = array_merge($additional_option_codes, $option_codes);
        //$this->debug['equipment_extracted_codes'] = array_merge($this->debug['equipment_extracted_codes'], $additional_option_codes);


        if ($option_codes != $original_options) {
            $this->deal->option_codes = $option_codes;
            $this->deal->save();
        }
        return $found_option_codes;
    }

    /**
     * This is not at all performant, but getting pretty desperate.
     */
    public function buildFeaturesFromGuessedVautoNames()
    {
        $vautoFeatures = explode("|", $this->deal->vauto_features);
        $vautoFeatures = array_map('trim', $vautoFeatures);

        $features = $this->features
            ->reject(function ($feature) use ($vautoFeatures) {
                foreach ($vautoFeatures as $name) {
                    $score = levenshtein($name, $feature[0]);
                    if ($score < 5) {
                        return false;
                    }
                }
                return true;
            });

        //print "SUP";
        //print_r($features->toArray());

        //$this->categorizeDiscoveredFeatures($features);

        return null;
    }

    /**
     * @param $features
     * @param bool $reset
     */
    private function categorizeDiscoveredFeatures($features,  $reset = FALSE)
    {

        if ($reset) {
            $this->discovered_features = [];
        }

        foreach ($features as $feature) {
            $category = $feature->feature->category->title;
            if (!isset($this->discovered_features[$category])) {
                $this->discovered_features[$category] = [];
            }

            $this->discovered_features[$category][$feature->feature->id] = $feature;
        }
    }

    /**
     * Build features based on option codes.
     */
    public function buildFeaturesForOptionCodes()
    {
        $features = $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== "optional";
            })
            ->reject(function ($equipment) {
                return $equipment->optionCode === 'N/A';
            })
            ->reject(function ($equipment) {
                return !in_array($equipment->optionCode, $this->option_codes);
            })
            ->map(function ($equipment) {
                return $this->getFeatureFromEquipment($equipment);
            })
            ->filter()
            ->unique();

        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * Build features based on option codes.
     */
    public function buildFeaturesForMiscData()
    {
        $features = $this->equipment
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
     * Build features based on standard equipment
     */
    public function buildFeaturesForStandardEquipment()
    {
        $features = $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== 'standard';
            })
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
    public function buildFeaturesForKnownAttributes()
    {
        $parentSchemasIds = [
            59801,  // mobile (android etc)
            1301, // audio system 1301
        ];

        $features = $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability !== 'standard';
            })
            ->reject(function ($equipment) use ($parentSchemasIds) {
                return !in_array($equipment->schemaId, $parentSchemasIds);
            })
            ->flatMap(function ($equipment) {
                return $equipment->attributes;
            })
            ->reject(function ($attribute) {
                return $attribute->value != 'yes';
            })
            ->map(function ($attribute) {
                $feature = $this->getFeatureFromJatoSchemaId((object) ['schemaId' => $attribute->schemaId]);
                if (!$feature) {
                    return null;
                }

                return (object) [
                    'feature' => $feature,
                    'equipment' => (object) [
                        'optionId' => 0,
                        'schemaId' => $attribute->schemaId,
                  ],
                ];

            })
            ->filter();

        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * Just a helper
     */
    public function equipmentDebugger()
    {
        $this->equipment
            ->map(function ($equipment) {
                if ($equipment->category == "Safety & Driver Assist"){
                }
            });
    }

    /**
     * @param \stdClass $equipment
     * @return \stdClass|null
     */
    private function getFeatureFromEquipment(\stdClass $equipment): ?\stdClass
    {
        $feature = $this->getFeatureFromSlugLookup($equipment);

        if (!$feature) {
            $feature = $this->getFeatureFromJatoSchemaId($equipment);
        }

        if ($feature) {
           return  (object) ['feature' => $feature, 'equipment' => $equipment];
        }

        return null;
    }

    /**
     * @param \stdClass $equipment
     * @return Feature|null
     */
    private function getFeatureFromJatoSchemaId(\stdClass $equipment): ?Feature
    {
        $features = Feature::whereRaw("JSON_CONTAINS(jato_schema_ids, '[$equipment->schemaId]')")->get();
        return $features->first();
    }

    /**
     * Given a specific equipment, return a feature or null if no feature was found.
     * @param \stdClass $equipment
     * @return Feature|null
     */
    private function getFeatureFromSlugLookup(\stdClass $equipment): ?Feature
    {
        $feature = null;

        //
        // Specifically pull out the schema ids we know we care about.
        switch ($equipment->schemaId) {
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
        }

        if ($feature) {
            return $feature;
        }

        return $feature;
    }

    /**
     * @param \stdClass $equipment
     * @return Feature|null
     */
    private function syncVehicleSize(\stdClass $equipment): ?Feature
    {
        if ($equipment->schemaId !== 176) {
            return null;
        }

        $segment = collect([
            'subcompact' => ['budget'],
            'compact' => ['compact pickup', 'lower mid', 'small'],
            'full-size' => ['full size', 'upper mid', 'luxury'],
            'mid-size' => ['compact suv', 'mid'],
            'minivan' => ['mini van'],
            'sports' => ['sports'],
        ])
            ->filter(function ($value) use ($equipment) {
                // Pull from value instead of availability--per Derek at JATO 2018-02-12
                return str_contains(strtolower($equipment->value), $value);
            })
            ->keys()
            ->first();

        return Feature::where('slug', $segment)->first();
    }

    /**
     * @param $equipment
     * @return Feature|null
     */
    private function syncFuelType($equipment): ?Feature
    {
        if ($equipment->schemaId !== 8701) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "Fuel type";
            })
            ->pluck('value')
            ->map(function ($value) {
                if (str_contains(strtolower($value), ['diesel', 'biodiesel'])) {
                    return 'fuel_type_diesel';
                } elseif (str_contains(strtolower($value), ['hybrid', 'electric'])) {
                    return 'fuel_type_hybrid_electric';
                } elseif (str_contains(strtolower($value), ['unleaded', 'unleaded premium', 'premium', 'e85'])) {
                    return 'fuel_type_gas';
                }
                return null;
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * @param \stdClass $equipment
     * @return Feature|null
     */
    private function syncTransmission(\stdClass $equipment): ?Feature
    {
        if ($equipment->schemaId !== 20601) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "Transmission type";
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', 'transmission_' . $slugKey)->first();
            })->first();
    }

    /**
     * @param $equipment
     * @return Feature|null
     */
    private function syncDriveTrain($equipment): ?Feature
    {
        if ($equipment->schemaId !== 6501) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "Driven wheels";
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', 'drive_train_' . strtolower($slugKey))->first();
            })->first();
    }

    /**
     * @param $equipment
     * @return Feature|null
     */
    private function syncSeatMaterials($equipment): ?Feature
    {
        if ($equipment->schemaId !== 17401) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "main seat material";
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
                return null;
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * @param $equipment
     * @return Feature|null
     */
    private function syncSeatingConfiguration($equipment): ?Feature
    {
        if ($equipment->schemaId !== 701) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "seating configuration";
            })
            ->pluck('value')->map(function ($value) {
                if (str_contains(strtolower($value), ['2+3+3+4'])) {
                    return 'fourth_row_seating';
                } elseif (str_contains(strtolower($value), ['2+3+2', '2+3+3', '2+2+2', '2+2+3', '2+3+3'])) {
                    return 'third_row_seating';
                } elseif (str_contains(strtolower($value), ['2+3'])) {
                    return 'second_row_bench';
                } elseif (str_contains(strtolower($value), ['2+2'])) {
                    return 'second_row_captains_chairs';
                }
                return null;
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * TODO: Why does this exist?
     * @param $equipment
     * @return Feature|null
     */
    private function syncPickupSeatingConfiguration($equipment): ?Feature
    {
        if ($equipment->schemaId !== 701) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "seating configuration";
            })
            ->pluck('value')
            ->map(function ($value) {
                if (str_contains(strtolower($value), ['2+0', '3+0'])) {
                    return 'regular_cab';
                } elseif (str_contains(strtolower($value), ['2+2', '2+3', '3+3'])) {
                    return strtolower($this->version->cab) . '_cab';
                }
                return null;
            })
            ->filter()
            ->unique()
            ->map(function ($slugKey) {
                return Feature::where('slug', $slugKey)->first();
            })->first();
    }

    /**
     * @param $equipment
     * @return Feature|null
     */
    private function syncPickup($equipment): ?Feature
    {
        if ($equipment->schemaId !== 14201) {
            return null;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "box length";
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', strtolower($slugKey) . '_bed')->first();
            })->first();
    }
}
