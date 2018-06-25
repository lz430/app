<?php

namespace App\Http\Controllers\API;

use App\Services\Search\DealSearch;
use App\Services\Search\ESPaginatorAdapter;
use App\Transformers\DealSearchTransformer;
use Illuminate\Http\Request;

use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends BaseAPIController
{
    private const RESOURCE_NAME = 'deals';

    public function getDeals(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'model_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'year' => 'sometimes|required|digits:4',
            'sort' => 'sometimes|required|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        $query = new DealSearch();

        if ($request->get('latitude') && $request->get('longitude')) {
            $query = $query->filterMustLocation(['lat' => $request->get('latitude'), 'lon' => $request->get('longitude')]);
        }

        if ($request->get('body_styles')) {
            $query = $query->filterMustStyles($request->get('body_styles'));
        }

        if ($request->get('make_ids')) {
            $query = $query->filterMustMakes($request->get('make_ids'), 'name');
        }

        if ($request->get('model_ids')) {
            $query = $query->FilterMustModels($request->get('model_ids'), 'id');
        }

        if ($request->get('year')) {
            $query = $query->FilterMustYears([$request->get('year')]);
        }

        if ($request->get('features')) {
            $query = $query->filterMustLegacyFeatures($request->get('features'));
        }

        if ($request->get('sort')) {
            $query = $query->sort($request->get('sort'));
        }

        $page = ($request->get('page') ? $request->get('page') - 1 : 0);

        $per_page = 24;
        $query = $query
            ->size($per_page)
            ->from($page * $per_page);


        $results = $query->get();
        if (isset($results['hits']['hits'])) {
            $documents = $results['hits']['hits'];
        } else {
            $documents = [];
        }


        return fractal()
            ->collection($documents)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(DealSearchTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new ESPaginatorAdapter($results, $page, $per_page))
            ->respond();
    }
}
