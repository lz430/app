<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use App\Models\Feature;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Http\Request;

use League\Fractal\Serializer\ArraySerializer;
use App\Transformers\DealTransformer;


class DealsCompareController extends BaseAPIController
{
    private $client;
    private $deals;
    private $potentialEquipment;
    private $equipmentOnDeals;
    private $compData;

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

    private function buildPotentialDealEquipment($deal)
    {
        try {
            return $this->client->equipment->get($deal->version->jato_vehicle_id)->results;
        } catch (ClientException $e) {
            return [];
        }
    }

    private function findStandardDealEquipment($deal)
    {
        return $this->potentialEquipment[$deal->id]
            ->reject(function ($equipment) {
                return $equipment->availability !== 'standard';
            })->all();
    }

    private function findOptionalDealEquipment($deal)
    {
        $codes = array_merge($deal->package_codes, $deal->option_codes);

        return $this->potentialEquipment[$deal->id]
            ->reject(function ($equipment) {
                return $equipment->availability !== "optional";
            })
            ->reject(function ($equipment) use ($codes) {
                return !in_array($equipment->optionCode, $codes);
            })->all();
    }


    private function dealEquipment()
    {
        $deals = $this->deals;

        //
        // Build Equipment
        foreach ($deals as $deal) {
            $equipment = $this->buildPotentialDealEquipment($deal);
            $this->potentialEquipment[$deal->id] = collect($equipment);
        }

        //
        // Find standard equipment.
        foreach ($deals as $deal) {
            $data = [];
            $equipments = $this->findStandardDealEquipment($deal);

            foreach ($equipments as $equipment) {
                $data[$equipment->schemaId] = $equipment;
            }
            $this->equipmentOnDeals[$deal->id] = $data;
        }

        //
        // Find optional equipment
        foreach ($deals as $deal) {
            foreach ($this->findOptionalDealEquipment($deal) as $equipment) {
                $this->equipmentOnDeals[$deal->id][$equipment->schemaId] = $equipment;
            }
        }
    }

    private function organizeEquipmentOnDeal()
    {
        foreach ($this->equipmentOnDeals as $key => $dealEquipment) {
            $equipmentCategories = [];

            foreach ($dealEquipment as $equipment) {
                if (in_array($equipment->name, self::EQUIPMENT_TO_SKIP)) {
                    continue;
                }

                if (!isset($equipmentCategories[$equipment->category])) {
                    $equipmentCategories[$equipment->category] = [];
                }

                $equipmentCategories[$equipment->category][$equipment->schemaId] = $equipment;
            }

            $this->equipmentOnDeals[$key] = $equipmentCategories;
        }

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
                $labels[$attributes['overall length (in)']->schemaId] = "External: L: {$attributes['overall length (in)']->value}\" - W: {$attributes['overall width (in)']->value}\" - H: {$attributes['overall height (in)']->value}\"";
                break;
            case 'Fuel economy':
                $labels[$attributes['urban (mpg)']->schemaId] = "{$attributes['urban (mpg)']->value} / {$attributes['country/highway (mpg)']->value}";
                break;
            case 'Wheels':
                $labels[$attributes['rim diameter (in)']->schemaId] = $attributes['rim diameter (in)']->value . "\" rims";
                break;
            case 'Drive':
                $labels[$attributes['Driven wheels']->schemaId] = $attributes['Driven wheels']->value;
                break;
            case 'Transmission':
                $labels[$attributes['Transmission type']->schemaId] = "{$attributes['number of speeds']->value} speed {$attributes['Transmission type']->value}";
                break;
            case 'Weights':
                $val = number_format($attributes['gross vehicle weight (lbs)']->value);
                $labels[$attributes['gross vehicle weight (lbs)']->schemaId] = "Weight: {$val} (lbs)";
                break;
            case 'Tires':
                $labels[$attributes['type']->schemaId] = "tires: {$attributes['type']->value}";
                break;
            case 'Engine';
                $labels[$equipment->schemaId] = "{$attributes['Liters']->value} v{$attributes['number of cylinders']->value} {$attributes['configuration']->value}";
                break;
            case 'Fuel';
                $labels[$equipment->schemaId] = "Fuel Type: {$attributes['Fuel type']->value}";
                break;

            default:
                $feature = Feature::withJatoSchemaId($equipment->schemaId)->get()->first();
                if ($feature) {
                    $labels[$equipment->schemaId] = $feature->title;
                }  else {
                    $labels[$equipment->schemaId] = $equipment->name;
                }
                break;

        }

        return $labels;
    }


    private function processAndCompareEquipment()
    {
        $compData = [];
        $dealCount = count($this->deals);
        $equipmentOnDeals = array_values($this->equipmentOnDeals);
        foreach ($equipmentOnDeals as $key => $categories) {
            foreach ($categories as $category => $equipments) {

                if (!isset($compData[$category])) {
                    $compData[$category] = [];
                }

                foreach ($equipments as $equipment) {
                    $labels = $this->getLabelsForJatoEquipment($equipment);

                    foreach ($labels as $schemaId => $label) {
                        if (!isset($compData[$category][$schemaId])) {
                            $compData[$category][$schemaId] = array_fill(0, $dealCount, '--');
                        }
                        $compData[$category][$schemaId][$key] = $label;
                    }
                }
            }
        }

        unset($compData['Pricing']);
        unset($compData['General']);

        $this->compData = $compData;
    }

    private function valueInEquipmentArray($row)
    {
        foreach ($row as $item) {
            if ($item != '--') {
                return $item;
            }
        }

        return 0;
    }

    private function sortCompData()
    {
        foreach ($this->compData as $key => &$data) {
            uasort($data, function ($a, $b) {
                $aValue = $this->valueInEquipmentArray($a);
                $bValue = $this->valueInEquipmentArray($b);

                if ($aValue == $bValue) {
                    return 0;
                }
                return ($aValue < $bValue) ? -1 : 1;

            });
        }
    }

    public function compare(Request $request, JatoClient $client)
    {
        $this->client = $client;

        $this->validate($request, [
            'deals' => 'required|array',
            'deals.*' => 'integer'
        ]);

        //
        // Load Deals
        $dealIds = $request->get('deals');
        $deals = Deal::whereIn('id', $dealIds)->get();
        foreach ($deals as $deal) {
            $this->deals[$deal->id] = $deal;
        }

        $this->dealEquipment();
        $this->organizeEquipmentOnDeal();
        $this->processAndCompareEquipment();
        $this->sortCompData();

        $compData = $this->compData;

        //
        // Reorganize into cols.
        $cols = [];
        foreach ($deals as $key => $deal) {
            $col = [];

            $col['deal'] = fractal($deal)
                ->transformWith(DealTransformer::class)
                ->serializeWith(new ArraySerializer)->toArray();

            $col['equipment'] = [];

            foreach ($compData as $category => $equipments) {
                if (!isset($col['equipment'][$category])) {
                    $col['equipment'][$category] = [];
                }

                foreach ($equipments as $equipment) {
                    $col['equipment'][$category][] = $equipment[$key];
                }
            }

            $cols[] = $col;
        }

        return response()->json($cols);
    }
}
