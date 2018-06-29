<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
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
    private function getLabelForJatoEquipment($equipment)
    {
        return $equipment->name;
    }

    private function processAndCompareEquipment() {
        $compData = [];
        $dealCount = count($this->deals);
        $equipmentOnDeals = array_values($this->equipmentOnDeals);
        foreach ($equipmentOnDeals as $key => $categories) {
            foreach ($categories as $category => $equipments) {

                if (!isset($compData[$category])) {
                    $compData[$category] = [];
                }

                foreach ($equipments as $equipment) {
                    if (!isset($compData[$category][$equipment->schemaId])) {
                        $compData[$category][$equipment->schemaId] = array_fill(0, $dealCount, '--');
                    }

                    $compData[$category][$equipment->schemaId][$key] = $this->getLabelForJatoEquipment($equipment);
                }
            }
        }

        unset($compData['Pricing']);
        unset($compData['General']);

        $this->compData = $compData;
    }

    private function valueInEquipmentArray($row) {
        foreach($row as $item){
            if ($item != '--') {
                return $item;
            }
        }

        return 0;
    }

    private function sortCompData() {
        foreach($this->compData as $key => &$data) {
            uasort($data, function($a, $b) {
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

                foreach($equipments as $equipment) {
                    $col['equipment'][$category][] = $equipment[$key];
                }
            }

            $cols[] = $col;
        }

        return response()->json($cols);
    }
}
