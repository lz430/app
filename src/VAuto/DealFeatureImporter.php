<?php

namespace DeliverMyRide\VAuto;

use App\Feature;
use Facades\App\JATO\Log;

class DealFeatureImporter
{
    private $client;
    private $deal;
    private $features;
    private $version;

    public function __construct($deal, $features, $client)
    {
        $this->deal = $deal;
        $this->features = $features;
        $this->client = $client;
        $this->version = $this->deal->versions->first();
    }

    public function import()
    {
        $schemaIds = $this->jatoEquipment()->reject(function ($equipment) {
            return $equipment['availability'] === 'not available';
        })->flatMap(function ($equipment) {
            if ($equipment['optionCode'] !== 'N/A' && in_array($equipment['optionCode'], $this->deal->option_codes)) {
                $matchingFeatures = Feature::where('jato_schema_ids', $equipment['schemaId'])->get();

                // Some of the custom mappings have more than one feature with the same schemaIds, so if multiple features are returned here,
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

                if ($equipment['availability'] === 'standard') {
                    return $this->schemaIdMatches($equipment, $feature);
                }
            })->flatten()->reject(function ($schema) {
                return empty($schema);
            });
        })->unique()->toArray();

        $this->deal->features()->syncWithoutDetaching($schemaIds);
    }

    private function equipmentMatchesFeature($schemaId, $feature) {
        return in_array($schemaId, $feature->jato_schema_ids);
    }

    private function attributeValueIsTruthy($value) {
        return !in_array($value, ['no', 'none', '-']);
    }

    private function schemaIdMatches($equipment, $feature)
    {
        if ($this->equipmentMatchesFeature($equipment['schemaId'], $feature)) {
            return [$feature->id];
        }

        $matchedAttributes = collect($equipment['attributes'])->filter(function ($attribute) use ($feature) {
            return $this->equipmentMatchesFeature($attribute['schemaId'], $feature) && $this->attributeValueIsTruthy($attribute['value']);
        });

        return $matchedAttributes->count() ? [$feature->id] : null;
    }

    private function jatoEquipment()
    {
        return collect($this->client->equipmentByVehicleId($this->version->jato_vehicle_id)['results']);
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

        if (! $feature || $feature->isEmpty()) {
            // Log::error('Importer error for vin [' . $this->deal['VIN']. ']: could not find mapping for schemaId ' . $equipment['schemaId']);
            return null;
        }

        return $feature->count() ? $feature->first()->id : null;
    }

    private function syncVehicleSize($equipment)
    {
        if ($equipment['schemaId'] !== 176) {
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
            return str_contains(strtolower($equipment['availability']), $value);
        })->keys();

        return Feature::where('slug', $segment->first())->get();
    }

    private function syncFuelType($equipment)
    {
        if ($equipment['schemaId'] !== 8701) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "Fuel type";
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
        if ($equipment['schemaId'] !== 20601) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "Transmission type";
        })->pluck('value')->map(function ($slugKey) {
            return Feature::where('slug', 'transmission_' . $slugKey)->first();
        });
    }

    private function syncDriveTrain($equipment)
    {
        if ($equipment['schemaId'] !== 6501) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "Driven wheels";
        })->pluck('value')->map(function ($slugKey) {
            return Feature::where('slug', 'drive_train_' . strtolower($slugKey))->first();
        });
    }

    private function syncSeatMaterials($equipment)
    {
        if ($equipment['schemaId'] !== 17401) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "main seat material";
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
        if ($equipment['schemaId'] !== 701) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "seating configuration";
        })->pluck('value')->map(function ($value) {
            if (str_contains(strtolower($value), ['2+3'])) {
                return 'second_row_bench';
            } elseif (str_contains(strtolower($value), ['2+2'])) {
                return 'second_row_captains_chairs';
            } elseif (str_contains(strtolower($value), ['2+3+2', '2+3+3', '2+2+2'])) {
                return 'third_row_seating';
            } elseif (str_contains(strtolower($value), ['2+3+3+4'])) {
                return 'fourth_row_seating';
            }
        })->filter()->unique()->map(function ($slugKey) {
            return Feature::where('slug', $slugKey)->first();
        });
    }

    private function syncPickupSeatingConfiguration($equipment)
    {
        if ($equipment['schemaId'] !== 701) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "seating configuration";
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
        if ($equipment['schemaId'] !== 14201) {
            return;
        }

        return collect($equipment['attributes'])->filter(function ($attribute) {
            return $attribute['name'] == "box length";
        })->pluck('value')->map(function ($slugKey) {
            return Feature::where('slug', strtolower($slugKey) . '_bed')->first();
        });
    }
}
