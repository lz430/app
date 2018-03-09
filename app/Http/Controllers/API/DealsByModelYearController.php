<?php

namespace App\Http\Controllers\API;

use App\Transformers\DealTransformer;
use App\Deal;
use App\Zipcode;
use DeliverMyRide\JATO\Client;
use DeliverMyRide\JsonApi\Sort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Serializer\DataArraySerializer;
use App\Http\Controllers\API\Traits\SearchesDeals;
use App\JATO\VehicleModel;

class DealsByModelYearController extends BaseAPIController
{
    use SearchesDeals;

    private const TRANSFORMER = DealTransformer::class;
    private const RESOURCE_NAME = 'deals';

    public function getDealsByModelYear(Request $request, Client $client)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $deals = $this->buildSearchQuery($request)->paginate(400);

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
