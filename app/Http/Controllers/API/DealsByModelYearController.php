<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\Traits\SearchesDeals;
use App\Models\JATO\VehicleModel;
use DeliverMyRide\JATO\JatoClient;
use Illuminate\Http\Request;


class DealsByModelYearController extends BaseAPIController
{
    use SearchesDeals;

    public function getDealsByModelYear(Request $request, JatoClient $client)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $deals = $this->buildSearchQuery($request)->get();

        /* @TODO – This is terrible and insanely memory intensive. Needs badly to be rewritten. Sorry ~DC */
        $dealsByModelYear = $deals->map(function ($deal) {
            $deal->model_id = $deal->version->model_id;
            return $deal;
        })->groupBy(function ($item, $key) {
            return $item->model_id . '--' . $item->year;
        })->map(function ($deals, $modelId) {
            $model = VehicleModel::find($modelId);
            return [
                'id' => str_before($modelId, '--'),
                'make' => $model->make->name,
                'model' => $model->name,
                'year' =>  str_after($modelId, '--'),
                'deals' => [
                    'count' => $deals->count(),
                    'ids' => $deals->pluck('id'),
                ],
                'lowest_msrp' => $deals->sortBy('msrp')->first()->msrp,
            ];
        })->values();

        return $dealsByModelYear;
    }
}
