<?php

namespace DeliverMyRide\VAuto;

use App\Models\Feature;
use Illuminate\Support\Facades\Log;
use DeliverMyRide\JATO\JatoClient;

use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;

class DealFeatureImporter
{
    private $client;
    private $deal;
    private $features;
    private $version;

    /**
     * DealFeatureImporter constructor.
     * @param $deal
     * @param $features
     * @param JatoClient $client
     */
    public function __construct($deal, $features, JatoClient $client)
    {
        $this->deal = $deal;
        $this->features = $features;
        $this->client = $client;
        $this->version = $this->deal->version;
    }

    /**
     *
     */
    public function import()
    {
        $this->deal->features()->syncWithoutDetaching($this->featureIds());
    }

    /**
     * Sends call to jato for getting all possible package codes for a vehicle
     * @return array
     */
    private function getAllAvailablePackageCodes()
    {
        $vehicleId = $this->version->jato_vehicle_id;
        $findPackages = $this->client->option->get($vehicleId, 'P')->options;
        $packagesOnThisVehicle = $findPackages;

        $foundPackages = [];
        foreach($packagesOnThisVehicle as $package) {
            $foundPackages[] = $package->optionCode;
        }

        return $foundPackages;
    }

    /**
     * Compares option codes from csv to the available packages from jato and removes package codes
     * from the original list of option codes from csv
     * @return array
     */
    private function removeFoundPackagesFromOptionsList()
    {
        $optionCodesFromCsv = $this->deal->option_codes;
        $jatoPackagesOnVehicle = $this->getAllAvailablePackageCodes();
        $compareOptionsWithPackages = array_intersect($optionCodesFromCsv, $jatoPackagesOnVehicle);
        $pullPackagesOutOfList = array_diff($optionCodesFromCsv, $compareOptionsWithPackages);

        $revisedOptionCodesList = $pullPackagesOutOfList;

        return $revisedOptionCodesList;
    }

    private function mergedSchemaIds()
    {
        /** Package Decoding Options Logic */
        $vehicleId = $this->version->jato_vehicle_id;
        $originalOptionCodes = $this->deal->option_codes;
        $revisedListOfOptionCodes = $this->removeFoundPackagesFromOptionsList();

        $jatoPackagesOnVehicle = $this->getAllAvailablePackageCodes();
        $matchedPackageCode = array_intersect($originalOptionCodes, $jatoPackagesOnVehicle);

        $packagesOnThisVehicle = $matchedPackageCode;

        $decodedPackageEquipment = [];

        foreach ($packagesOnThisVehicle as $package) {
            $optionCode = $package;


            // Decode package into a list of equipment and add to our array
            try {
                $searchCode = $this->client->equipment->get($vehicleId, ['packageCode' => $optionCode])->results;
                foreach ($searchCode as $equipment) {
                    $decodedPackageEquipment[] = $equipment->schemaId;
                }
            } catch (ClientException | ServerException $e) {
                if ($e->getCode() === 404) {
                    // @todo log
                    continue;
                }
            }
        }

        // Combines the current deal options codes with the newly searched package schema id's
        //$combinedDealCodes = array_merge($this->deal->option_codes, $decodedPackageEquipment);
        $combinedDealCodes = array_merge($revisedListOfOptionCodes, $decodedPackageEquipment);
        /** End of Package Decoding Options Logic */

        return $combinedDealCodes;
    }

    public function featureIds()
    {
        $combinedDealCodes = $this->mergedSchemaIds();

        return $this->jatoEquipment()->reject(function ($equipment) {
            return $equipment->availability === 'not available';
        })->flatMap(function ($equipment) use($combinedDealCodes) { // use ($combinedDealCodes)
            if ($equipment->optionCode !== 'N/A' && in_array($equipment->optionCode, $combinedDealCodes)) { // $this->deal->option_codes
                //$matchingFeatures = Feature::where('jato_schema_ids', $equipment->schemaId)->get();
                $equipmentSchemaId = $equipment->schemaId;
                $matchingFeatures = Feature::whereRaw("JSON_CONTAINS(jato_schema_ids, '[$equipmentSchemaId]')")->get();

                // Some of the custom mappings have more th an one feature with the same schemaIds, so if multiple features are returned here,
                // we'll have to loop through them below in parseCustomJatoMappingDmrCategories() to handle string comparison
                // If there's only one match, however, we can assume that deal has that optional feature
                if ($matchingFeatures->count() === 1) {
                    return [$matchingFeatures->first()->id];
                }

                if ($matchingFeatures->isEmpty()) {
                    return null;
                }
            }

            return $this->features->map(function ($feature) use ($equipment) {
                if ($feature->category->has_custom_jato_mapping) {
                    return $this->parseCustomJatoMappingDmrCategories($feature->category, $equipment);
                }

                if ($equipment->availability === 'standard') {
                    return $this->schemaIdMatches($equipment, $feature);
                }
            })->flatten()->reject(function ($schema) {
                return empty($schema);
            });
        })->unique()->toArray();
    }

    private function equipmentMatchesFeature($schemaId, $feature) {
        return in_array($schemaId, $feature->jato_schema_ids);
    }

    private function attributeValueIsTruthy($value) {
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

    private function jatoEquipment()
    {
        return collect($this->client->equipment->get($this->version->jato_vehicle_id)->results);
    }

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

        if (! $feature || $feature->isEmpty() || ! $feature->first()) {
            // Log::channel('jato')->error('Importer error for vin [' . $this->deal['VIN']. ']: could not find mapping for schemaId ' . $equipment['schemaId']);
            return null;
        }

        return $feature->count() ? $feature->first()->id : null;
    }

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
        ])->filter(function ($value) use ($equipment) {
            // Pull from value instead of availability--per Derek at JATO 2018-02-12
            return str_contains(strtolower($equipment->value), $value);
        })->keys()->first();

        return Feature::where('slug', $segment)->get();
    }

    private function syncFuelType($equipment)
    {
        if ($equipment->schemaId !== 8701) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "Fuel type";
        })->pluck('value')->map(function ($value) {
            if (str_contains(strtolower($value), ['diesel', 'biodiesel'])) {
                return 'fuel_type_diesel';
            } elseif (str_contains(strtolower($value), ['hybrid', 'electric'])) {
                return 'fuel_type_hybrid_electric';
            } elseif (str_contains(strtolower($value), ['unleaded', 'unleaded premium', 'premium', 'e85'])) {
                return 'fuel_type_gas';
            }
        })->filter()->unique()->map(function ($slugKey) {
            return Feature::where('slug', $slugKey)->first();
        });
    }

    private function syncTransmission($equipment)
    {
        if ($equipment->schemaId !== 20601) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "Transmission type";
        })->pluck('value')->map(function ($slugKey) {
            return Feature::where('slug', 'transmission_' . $slugKey)->first();
        });
    }

    private function syncDriveTrain($equipment)
    {
        if ($equipment->schemaId !== 6501) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "Driven wheels";
        })->pluck('value')->map(function ($slugKey) {
            return Feature::where('slug', 'drive_train_' . strtolower($slugKey))->first();
        });
    }

    private function syncSeatMaterials($equipment)
    {
        if ($equipment->schemaId !== 17401) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "main seat material";
        })->pluck('value')->map(function ($value) {
            if (str_contains(strtolower($value), ['cloth', 'synthetic suede'])) {
                return 'seat_main_upholstery_cloth';
            } elseif (str_contains(strtolower($value), ['synthetic leather', 'vinyl'])) {
                return 'seat_main_upholstery_vinyl';
            } elseif (str_contains(strtolower($value), ['suede'])) {
                return 'seat_main_upholstery_suede';
            } elseif (str_contains(strtolower($value), ['leather'])) {
                return 'seat_main_upholstery_leather';
            }
        })->filter()->unique()->map(function ($slugKey) {
            return Feature::where('slug', $slugKey)->first();
        });
    }

    private function syncSeatingConfiguration($equipment)
    {
        if ($equipment->schemaId !== 701) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "seating configuration";
        })->pluck('value')->map(function ($value) {
            if (str_contains(strtolower($value), ['2+3+3+4'])) {
                return 'fourth_row_seating';
            } elseif (str_contains(strtolower($value), ['2+3+2', '2+3+3', '2+2+2', '2+2+3', '2+3+3'])) {
                return 'third_row_seating';
            } elseif (str_contains(strtolower($value), ['2+3'])) {
                return 'second_row_bench';
            } elseif (str_contains(strtolower($value), ['2+2'])) {
                return 'second_row_captains_chairs';
            }
        })->filter()->unique()->map(function ($slugKey) {
            return Feature::where('slug', $slugKey)->first();
        });
    }

    private function syncPickupSeatingConfiguration($equipment)
    {
        if ($equipment->schemaId !== 701) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "seating configuration";
        })->pluck('value')->map(function ($value) {
            if (str_contains(strtolower($value), ['2+0', '3+0'])) {
                return 'regular_cab';
            } elseif (str_contains(strtolower($value), ['2+2', '2+3', '3+3'])) {
                return strtolower($this->version->cab) . '_cab';
            }
        })->filter()->unique()->map(function ($slugKey) {
            return Feature::where('slug', $slugKey)->first();
        });
    }

    private function syncPickup($equipment)
    {
        if ($equipment->schemaId !== 14201) {
            return;
        }

        return collect($equipment->attributes)->filter(function ($attribute) {
            return $attribute->name == "box length";
        })->pluck('value')->map(function ($slugKey) {
            return Feature::where('slug', strtolower($slugKey) . '_bed')->first();
        });
    }
}
