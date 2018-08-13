<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Feature;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;
use DeliverMyRide\VAuto\Map;
use Carbon\Carbon;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;

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
    private $vauto_features;

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
        $this->discovered_features = [];
        $this->vauto_features = [];

        $this->debug = [
            'equipment_extracted_codes' => [],
            'equipment_feature_count' => 0,
            'equipment_skipped' => 'Yes',
        ];
    }

    /**
     * @param bool $force
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function import(bool $force = FALSE)
    {
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

        //
        // Get get data sources
        $this->initializeData();

        // If we don't have any equipment something is probably wrong
        if (!$this->equipment->count()) {
            return $this->debug;
        }

        $this->processVautoFeature();

        //
        // Option codes & package codes
        $this->buildOptionsAndPackages();
        $this->initializeOptionCodes();

        //
        // Find information for the deal model
        $this->syncSeatingCapacity();

        //
        // Finally get some features.
        $this->buildFeaturesForMiscData();
        $this->buildFeaturesForStandardEquipment();
        $this->buildFeaturesForOptionCodes();
        $this->buildFeaturesForKnownAttributes();
        $this->buildFeaturesForMappedVautoData();

        //
        // Remove conflicting features
        $this->removeConflictingFeatures();

        //
        // Save discovered features to deal.
        $this->deal->save();
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
            foreach ($features as $feature) {
                if (!isset($reduced[$feature->equipment->schemaId])) {
                    $reduced[$feature->equipment->schemaId] = $feature;
                } elseif ($reduced[$feature->equipment->schemaId]->equipment->optionId < $feature->equipment->optionId) {
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
            $this->option_codes = array_merge($this->deal->option_codes, $this->deal->package_codes);
        }
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionEquipment(): \Illuminate\Support\Collection
    {
        try {
            return collect($this->client->equipment->get($this->version->jato_vehicle_id)->results);
        } catch (ServerException | ClientException $e) {
            return collect([]);
        }
    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionPackages(): \Illuminate\Support\Collection
    {
        try {
            return collect($this->client->option->get($this->version->jato_vehicle_id, 'P')->options);
        } catch (ServerException | ClientException $e) {
            return collect([]);
        }

    }

    /**
     * @return \Illuminate\Support\Collection
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function fetchVersionOptions(): \Illuminate\Support\Collection
    {
        try {
            return collect($this->client->option->get($this->version->jato_vehicle_id, 'O')->options);
        } catch (ServerException | ClientException $e) {
            return collect([]);
        }
    }

    public function buildOptionsAndPackages()
    {
        $packages = $this->deal->package_codes ? $this->deal->package_codes : [];
        $options = $this->deal->option_codes ? $this->deal->option_codes : [];

        $packagesAndOptions = array_merge($packages, $options);
        $packagesAndOptions = array_merge($packagesAndOptions, $this->extractPackageCodesFromVautoFeatures());
        $packagesAndOptions = array_merge($packagesAndOptions, $this->extractAdditionalOptionCodes());
        $packagesAndOptions = array_merge($packagesAndOptions, $this->extractPackagesOrOptionsFromTransmission());
        $packagesAndOptions = array_filter($packagesAndOptions);
        $packagesAndOptions = array_unique($packagesAndOptions);

        $packages = $this->packages
            ->reject(function ($package) use ($packagesAndOptions) {
                return !in_array($package->optionCode, $packagesAndOptions);
            })
            ->pluck('optionCode')
            ->all();

        $options = $this->options
            ->reject(function ($option) use ($packagesAndOptions) {
                return !in_array($option->optionCode, $packagesAndOptions);
            })
            ->pluck('optionCode')
            ->all();

        $this->deal->package_codes = $packages;
        $this->deal->option_codes = $options;

    }

    /**
     * Attempts to extract additional option codes for a given deal by checking how similar
     * a vauto feature is to a known jato optional equipment. if a feature is pretty close we assume
     * it's an option code the deal has and attach it to the vehicle.
     *
     * TODO:
     *  - Alloy Seats vs Black Seats returns "4"
     */
    public function extractAdditionalOptionCodes()
    {

        // TODO: Probably some smarter way to do this.
        $allOptional = $this->packages->merge($this->options);

        $options = $allOptional
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
        return $additional_option_codes;
    }

    /**
     * @return array
     */
    private function extractPackageCodesFromVautoFeatures()
    {
        $packageCodes = [];

        $rules = [
            "/(?<=(?i)Quick Order Package )(.*?)(?=\|| )/",
            "/(?<=(?i)Preferred Equipment Group )(.*?)(?=\|| )/",
            "/(?<=(?i)Equipment Group )(.*?)(?=\|| )/"
        ];

        foreach ($rules as $rule) {
            $matches = [];
            preg_match($rule, $this->deal->vauto_features, $matches);
            if (count($matches)) {
                $packageCodes += $matches;
            }
        }
        $packageCodes = array_unique($packageCodes);
        return $packageCodes;
    }

    /**
     * In many situations manual trans is standard and option codes / vauto features do not have any info
     * regarding transmission, so we see if we've got any options or packages for transmissions that might match.
     */
    private function extractPackagesOrOptionsFromTransmission()
    {
        $transmission = $this->deal->transmission;
        if (isset(Map::VAUTO_TRANSMISSION_TO_JATO_PACKAGE[$transmission])) {
            $transmission = Map::VAUTO_TRANSMISSION_TO_JATO_PACKAGE[$transmission];
        }

        // Most packages actually include the word transmission but vauto does not.
        if (!str_contains($transmission, "Transmission")) {
            $transmission .= " Transmission";
        }

        // Some transmissions don't fully label automatic
        // TODO: This might be too specific? review spreadsheet and see how often this actually comes up.
        if (str_contains($transmission, "Auto ")) {
            $transmission = str_replace("Auto ", "Automatic ", $transmission);
        }

        $allOptional = $this->packages->merge($this->options);
        $codes = $allOptional
            ->reject(function ($option) use ($transmission) {
                $score = levenshtein($option->optionName, $transmission);
                if ($score < 3) {
                    $this->debug['equipment_extracted_codes'][] = [
                        'Option Code' => $option->optionCode,
                        'Option Title' => $option->optionName,
                        'Feature' => "Transmission",
                        'Score' => $score,
                    ];

                    return false;
                }
                return true;
            })
            ->map(function ($option) {
                return $option->optionCode;
            })
            ->unique()
            ->all();

        return $codes;
    }

    /**
     * Turn the vauto features into something more useful.
     */
    private function processVautoFeature()
    {
        $vautoFeatures = explode("|", $this->deal->vauto_features);
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

    /**
     *
     */
    public function buildFeaturesForMappedVautoData()
    {
        $features = $this->vauto_features
            ->map(function ($item) {
                return Feature::withVautoFeature($item)->get()->first();
            })
            ->filter()
            ->unique()
            ->map(function ($feature) {
                return (object)[
                    'feature' => $feature,
                    'equipment' => (object)[
                        'optionId' => 0,
                        'schemaId' => "VA|" . $feature->title,
                    ],
                ];
            });
        $this->categorizeDiscoveredFeatures($features);
    }

    /**
     * @param $features
     * @param bool $reset
     */
    private function categorizeDiscoveredFeatures($features, $reset = FALSE)
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
            1301, // audio system
            17801, // Front seat
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
                $feature = $this->getFeatureFromJatoSchemaId((object)['schemaId' => $attribute->schemaId]);
                if (!$feature) {
                    return null;
                }

                return (object)[
                    'feature' => $feature,
                    'equipment' => (object)[
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
                if ($equipment->schemaId == '1101') {
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
            return (object)['feature' => $feature, 'equipment' => $equipment];
        }

        return null;
    }

    /**
     * @param \stdClass $equipment
     * @return Feature|null
     */
    private function getFeatureFromJatoSchemaId(\stdClass $equipment): ?Feature
    {
        return Feature::withJatoSchemaId($equipment->schemaId)->get()->first();
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
        if (!$segment) {
            return null;
        }

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
                    if($this->syncMildHybridEngineType() == "mild hybrid"){
                        return 'fuel_type_gas';
                    } else {
                        return 'fuel_type_hybrid_electric';
                    }
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

        $attributes = collect($equipment->attributes)->keyBy('name')->all();

        if (isset($attributes['automatic mode - manual']) && $attributes['automatic mode - manual']->value == 'yes') {
            $transmission = "automatic";
        } else if (isset($attributes['Transmission type'])) {
            $transmission = $attributes['Transmission type']->value;
        } else {
            return null;
        }

        return Feature::where('slug', 'transmission_' . $transmission)->first();
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
        $this->syncMildHybridEngineType();
        if ($equipment->schemaId !== 701) {
            return null;
        }
        $isPickup = $this->version->body_style === 'Pickup';

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "seating configuration";
            })
            ->pluck('value')->map(function ($value) use ($isPickup) {
                if ($isPickup) {
                    if (str_contains(strtolower($value), ['2+0', '3+0'])) {
                        return 'regular_cab';
                    } elseif (str_contains(strtolower($value), ['2+2', '2+3', '3+3'])) {
                        return strtolower($this->version->cab) . '_cab';
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

    /**
     * Gets the seating capacity from jato equipment for use
     * in filtering actual number of seats in a given car
     */
    private function syncSeatingCapacity()
    {
        $seatingCategory = $this->equipment
            ->filter(function ($equipment) {
                return $equipment->schemaId == 701;
            })
            ->first();

        if ($seatingCategory && isset($seatingCategory->attributes)) {
            $seatingCapacity = collect($seatingCategory->attributes);

            $capacity = $seatingCapacity
                ->filter(function ($attribute) {
                    return $attribute->name == "Seating capacity";
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
     * of the car there and then compare to updated list of jato sizes to DMR sizes
     *
     * @return string
     */
    private function syncEpaQualifierForSize()
    {
        $luxurySizes = $this->equipment
            ->filter(function ($equipment) {
                return $equipment->schemaId == 27601;
            })
            ->first();
        if (!$luxurySizes) {
            return null;
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
     * if hybrid type == mild hybrid and used when assigning engine types above to make for now gasoline
     * @return string
     */
    private function syncMildHybridEngineType()
    {
        $engine = $this->equipment
            ->filter(function ($equipment) {
                return $equipment->schemaId == 51801;
            })
            ->first();

        if($engine && $engine->availability !== "not available"){
            if ($engine && isset($engine->attributes)) {
                $engineType = collect($engine->attributes);

                return $engineType
                    ->filter(function($attribute){
                        return $attribute->name == "hybrid type";
                    })
                    ->pluck('value')
                    ->first();
            }
        }
    }
}
