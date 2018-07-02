<?php

namespace App\Http\Controllers\API;

use App\Services\Search\DealSearch;
use App\Transformers\ESResponseTransformer;
use Illuminate\Http\Request;

use League\Fractal\Serializer\ArraySerializer;

class DealsController extends BaseAPIController
{
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

        $query = $query
            ->addFeatureAggs()
            ->addMakeAndStyleAgg();

        if ($request->get('latitude') && $request->get('longitude')) {
            $query = $query->filterMustLocation(['lat' => $request->get('latitude'), 'lon' => $request->get('longitude')]);
        }

        if ($request->get('body_styles')) {
            $query = $query->filterMustStyles($request->get('body_styles'));
        }

        if ($request->get('make_ids')) {
            $query = $query->filterMustMakes($request->get('make_ids'));
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

        //return $results;

        return fractal()
            ->item(['response' => $results, 'meta' => [
                'entity' => 'deal',
                'current_page' => $page + 1,
                'per_page' => $per_page,
            ]])
            ->transformWith(ESResponseTransformer::class)
            ->serializeWith(new ArraySerializer)
            ->respond();

    }
}
