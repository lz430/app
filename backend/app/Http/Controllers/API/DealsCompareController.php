<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use Illuminate\Http\Request;
use DeliverMyRide\JATO\JatoClient;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\ArraySerializer;
use DeliverMyRide\JATO\Manager\DealCompareData;

class DealsCompareController extends BaseAPIController
{
    private $client;
    private $deals;
    private $equipmentOnDeals;
    private $compData;

    private function processAndCompareEquipment()
    {
        $compData = [];
        $dealCount = count($this->deals);
        $equipmentOnDeals = array_values($this->equipmentOnDeals);
        foreach ($equipmentOnDeals as $key => $categories) {
            foreach ($categories as $category => $equipments) {
                if (! isset($compData[$category])) {
                    $compData[$category] = [];
                }

                foreach ($equipments as $schemaId => $label) {
                    if (! isset($compData[$category][$schemaId])) {
                        $compData[$category][$schemaId] = array_fill(0, $dealCount, '--');
                    }
                    $compData[$category][$schemaId][$key] = $label;
                }
            }
        }
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
            'deals.*' => 'integer',
        ]);

        //
        // Load Deals
        $dealIds = $request->get('deals');
        $deals = Deal::whereIn('id', $dealIds)->get();
        foreach ($deals as $deal) {
            $this->deals[$deal->id] = $deal;
            $this->equipmentOnDeals[$deal->id] = (new DealCompareData($client, $deal))->build();
        }

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
                if (! isset($col['equipment'][$category])) {
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
