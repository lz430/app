<?php

namespace DeliverMyRide\VAuto\Deal;

use App\Models\Feature;
use App\Models\Deal;
use DeliverMyRide\JATO\JatoClient;

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

    /**
     * @param Deal $deal
     * @param $features
     * @param JatoClient $client
     */
    public function __construct(Deal $deal, $features, JatoClient $client)
    {

        $this->deal = $deal;
        $this->client = $client;
        $this->version = $this->deal->version;
        $this->features = $features;

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
        if (!$this->deal->features()->count() && !$force){
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
        $featureIds = [];
        $knownFeatureIds = $this->getFeaturesForDeal();
        $this->debug['equipment_known_feature_count'] = count($knownFeatureIds);

        $vautoGuessedFeatureIds = $this->getGuessedvAutoFeatureIds();
        $this->debug['equipment_vauto_feature_count'] = count($vautoGuessedFeatureIds);

        $this->debug['equipment_vauto_extra_feature_count'] = count(array_diff($vautoGuessedFeatureIds, $knownFeatureIds));

        $featureIds = array_merge($featureIds, $knownFeatureIds, $vautoGuessedFeatureIds);
        $featureIds = array_unique($featureIds);
        $this->debug['equipment_feature_count'] = count($featureIds);
        $this->deal->features()->sync($featureIds);

        return $this->debug;
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function initializeData() {
        $this->equipment = $this->fetchVersionEquipment();
        $this->packages = $this->fetchVersionPackages();
        $this->options = $this->fetchVersionOptions();
    }

    public function initializeOptionCodes($override = []) {
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
     * This is not at all performant, but getting pretty desperate.
     */
    public function getGuessedvAutoFeatureIds() {
        $features = $this->features
            ->map(function ($feature) {
                return [$feature->title, $feature->id];
            })->toArray();


        $vautoFeatures = explode("|", $this->deal->vauto_features);
        $vautoFeatures = array_map('trim', $vautoFeatures);

        $found_features = [];
        foreach($vautoFeatures as $name) {
            foreach($features as $feature) {
                $score = levenshtein($name, $feature[0]);
                if ($score < 5) {
                    $found_features[] = $feature[1];
                }
            }
        }

        return $found_features;

    }

    /**
     * Attempts to extract additional option codes for a given deal by checking how similar
     * a vauto feature is to a known jato optional equipment. if a feature is pretty close we assume
     * it's an option code the deal has and attach it to the vehicle.
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
                    $additional_option_codes[] = $code;
                }
            }
        }
        $found_option_codes = $additional_option_codes;

        $additional_option_codes = array_diff($additional_option_codes, $original_options);
        $option_codes = array_merge($additional_option_codes, $option_codes);
        $this->debug['equipment_extracted_codes'] = array_merge($this->debug['equipment_extracted_codes'], $additional_option_codes);
        if ($option_codes != $original_options) {
            $this->deal->option_codes = $option_codes;
            $this->deal->save();
        }
        return $found_option_codes;
    }

    /**
     * Returns an array of package codes.
     * @return array
     */
    private function getAllAvailablePackageCodes()
    {
        $packages = $this->packages->pluck('optionCode')->toArray();
        return $packages;
    }

    /**
     * Compares option codes from csv to the available packages from jato and removes package codes
     * from the original list of option codes from csv
     *
     * @return array
     */
    private function removeFoundPackagesFromOptionsList()
    {
        $jatoPackagesOnVehicle = $this->getAllAvailablePackageCodes();
        $compareOptionsWithPackages = array_intersect($this->option_codes, $jatoPackagesOnVehicle);
        $pullPackagesOutOfList = array_diff($this->option_codes, $compareOptionsWithPackages);

        $revisedOptionCodesList = $pullPackagesOutOfList;

        return $revisedOptionCodesList;
    }

    /**
     * @return array
     */
    private function mergedSchemaIds()
    {
        $revisedListOfOptionCodes = $this->removeFoundPackagesFromOptionsList();
        $decodedPackageEquipment = $this->equipment->pluck('schemaId')->all();
        $decodedPackageEquipment = array_unique($decodedPackageEquipment);
        $combinedDealCodes = array_merge($revisedListOfOptionCodes, $decodedPackageEquipment);
        return $combinedDealCodes;
    }

    /**
     * @return array
     */
    public function getFeaturesForDeal(): array
    {
        $combinedDealCodes = $this->mergedSchemaIds();

        return $this->equipment
            ->reject(function ($equipment) {
                return $equipment->availability === 'not available';
            })
            ->flatMap(function ($equipment) use ($combinedDealCodes) {

                //
                //
                if($equipment->optionCode !== 'N/A' && in_array($equipment->optionCode, $this->option_codes)) {

                    $equipmentSchemaId = $equipment->schemaId;

                    $matchingFeatures = Feature::whereRaw("JSON_CONTAINS(jato_schema_ids, '[$equipmentSchemaId]')")->get();

                    // Some of the custom mappings have more th an one feature with the same schemaIds, so if multiple features are returned here,
                    // we'll have to loop through them below in parseCustomJatoMappingDmrCategories() to handle string comparison
                    // If there's only one match, however, we can assume that deal has that optional feature
                    if ($matchingFeatures->count() === 1) {
                        return [$matchingFeatures->first()->id];
                    }

                    if ($matchingFeatures->isEmpty()) {

                        print " WTF === {$equipment->optionCode} | {$equipment->optionName} \n";
                        return null;
                    }
                }

                return $this->features
                    ->map(function ($feature) use ($equipment) {
                        if ($feature->category->has_custom_jato_mapping) {
                            return $this->parseCustomJatoMappingDmrCategories($feature->category, $equipment);
                        }

                        if ($equipment->availability === 'standard') {
                            return $this->schemaIdMatches($equipment, $feature);
                        }
                        return null;
                    })
                    ->filter()
                    ->flatten()
                    ->reject(function ($schema) {
                        return empty($schema);
                    });
            })->unique()->toArray();
    }

    private function equipmentMatchesFeature($schemaId, $feature): bool
    {
        return in_array($schemaId, $feature->jato_schema_ids);
    }

    private function attributeValueIsTruthy($value): bool
    {
        return !in_array($value, ['no', 'none', '-']);
    }

    private function schemaIdMatches($equipment, $feature)
    {
        if ($this->equipmentMatchesFeature($equipment->schemaId, $feature)) {
            return [$feature->id];
        }

        $matchedAttributes = collect($equipment->attributes)->filter(function ($attribute) use ($feature) {
            return $this->equipmentMatchesFeature($attribute->schemaId, $feature) && $this->attributeValueIsTruthy($attribute->value);
        });

        return $matchedAttributes->count() ? [$feature->id] : null;
    }

    /**
     * @param $category
     * @param $equipment
     * @return null
     */
    private function parseCustomJatoMappingDmrCategories($category, $equipment)
    {
        $isPickup = $this->version->body_style === 'Pickup';
        $feature = null;

        switch ($category->slug) {
            case 'vehicle_size':
                $feature = $this->syncVehicleSize($equipment);
                break;
            case 'fuel_type':
                $feature = $this->syncFuelType($equipment);
                break;
            case 'transmission':
                $feature = $this->syncTransmission($equipment);
                break;
            case 'drive_train':
                $feature = $this->syncDriveTrain($equipment);
                break;
            case 'seat_materials':
                $feature = $this->syncSeatMaterials($equipment);
                break;
            case 'seating_configuration':
                $feature = $isPickup ? $this->syncPickupSeatingConfiguration($equipment) : $this->syncSeatingConfiguration($equipment);
                break;
            case 'pickup':
                $feature = $isPickup ? $this->syncPickup($equipment) : null;
                break;
        }

        if (!$feature || $feature->isEmpty() || !$feature->first()) {
            return null;
        }

        return $feature->count() ? $feature->first()->id : null;
    }

    /**
     * @param $equipment
     */
    private function syncVehicleSize($equipment)
    {
        if ($equipment->schemaId !== 176) {
            return;
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

        return Feature::where('slug', $segment)->get();
    }

    private function syncFuelType($equipment)
    {
        if ($equipment->schemaId !== 8701) {
            return;
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
            });
    }

    private function syncTransmission($equipment)
    {
        if ($equipment->schemaId !== 20601) {
            return;
        }


        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "Transmission type";
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', 'transmission_' . $slugKey)->first();
            });
    }

    private function syncDriveTrain($equipment)
    {
        if ($equipment->schemaId !== 6501) {
            return;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "Driven wheels";
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', 'drive_train_' . strtolower($slugKey))->first();
            });
    }

    private function syncSeatMaterials($equipment)
    {
        if ($equipment->schemaId !== 17401) {
            return;
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
            });
    }

    private function syncSeatingConfiguration($equipment)
    {
        if ($equipment->schemaId !== 701) {
            return;
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
            });
    }

    private function syncPickupSeatingConfiguration($equipment)
    {
        if ($equipment->schemaId !== 701) {
            return;
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
            });
    }

    private function syncPickup($equipment)
    {
        if ($equipment->schemaId !== 14201) {
            return;
        }

        return collect($equipment->attributes)
            ->filter(function ($attribute) {
                return $attribute->name == "box length";
            })
            ->pluck('value')
            ->map(function ($slugKey) {
                return Feature::where('slug', strtolower($slugKey) . '_bed')->first();
            });
    }
}
