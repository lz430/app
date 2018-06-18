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
]
    public function getDeals(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'model_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'year' => 'sometimes|required|digits:4',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $query = new DealSearch();

        if ($request->get('zipcode')) {
            $query = $query->filterMustLocation($request->get('zipcode'), 'zipcode');
        }

        if ($request->get('body_styles')) {
            $query = $query->filterMustStyles($request->get('body_styles'));
        }

        if ($request->get('make_ids')) {
            $query = $query->filterMustMakes($request->get('make_ids'), 'id');
        }

        if ($request->get('model_ids')) {
            $query = $query->FilterMustModels($request->get('model_ids'), 'id');
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
