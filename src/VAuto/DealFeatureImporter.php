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
        $this->version = $this->deal->version;
    }

    public function import()
    {
        $this->deal->features()->syncWithoutDetaching($this->featureIds());
    }

    public function featureIds()
    {
        //return collect($this->client->equipmentByVehicleId($this->version->jato_vehicle_id)['results']);
        // Package code 27G

        //$this->get($path, $options, $async);


        //\Log::info($this->client->equipmentByVehicleId('742048320180301'));
        //$test = collect($this->client->equipmentByVehicleId('742048320180301')['results']);

        //\Log::info($this->client->optionsByVehicleId('792222620180309/Type/P')['options']);
        
        /* [2018-04-23 15:43:01] local.INFO: array (
            0 => 'ADE',
            1 => 'AAJ',
            2 => 'AEM',
            3 => 'AHQ',
          )*/

          /*[2018-04-23 17:20:08] local.INFO: array (
            0 => 33401,
            1 => 43401,
            2 => 7801,
            3 => 17801,
            4 => 17801,
            5 => 15101,
            6 => 37701,
            7 => 44801,
            8 => 46901,
            9 => 11901,
            10 => 18401,
            11 => 33801,
            12 => 15101,
            13 => 37701,
            14 => 44801,
            15 => 46901,
            16 => 11901,
            17 => 18401,
            18 => 33801,
            19 => 1601,
            20 => 15101,
            21 => 6601,
          )*/
        
        $findPackages = $this->client->optionsByVehicleId("792222620180309/Type/P")['options']; //$this->version->jato_vehicle_id
        $pArray = array();
        foreach($findPackages as $package) {
            $optionCode = $package['optionCode'];
            if(!in_array($optionCode, ['AEM'])){
                $searchCode = $this->client->equipmentByVehicleId("792222620180309?packageCode=$optionCode")['results']; //$this->version->jato_vehicle_id
                
                foreach($searchCode as $equipment) {
                    $pArray[] = $equipment['schemaId'];
                 }
            }
        }
       \Log::info($pArray);
       
        /*[2018-04-23 12:07:26] local.INFO: array (
            0 => 1601,
            1 => 15101,
            2 => 6601,
          )
          */
          /* [2018-04-23 12:18:25] local.INFO: array (
            0 => '24S',
            1 => 'DFT',
            2 => 'ADE',
            3 => 'ADC',
          ) */
        
        //merge package codes from deals array with new array
        //\Log::info(array_merge($testArray, $array));


        // $optionCodes = array_merge($this->deal->option_codes, $array);

        // TODO::possibly place code here to look up option code and place in below
        // $this->deal->option_codes function to insert other package option codes into for lookup
        return $this->jatoEquipment()->reject(function ($equipment) {
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

        if (! $feature || $feature->isEmpty() || ! $feature->first()) {
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
            // Pull from value instead of availability--per Derek at JATO 2018-02-12
            return str_contains(strtolower($equipment['value']), $value);
        })->keys()->first();

        return Feature::where('slug', $segment)->get();
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
