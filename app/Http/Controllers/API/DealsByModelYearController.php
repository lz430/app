<?php

namespace App\Http\Controllers\API;

use App\Services\Search\ModelYearSearch;
use Illuminate\Http\Request;
use App\Transformers\ESResponseTransformer;
use League\Fractal\Serializer\ArraySerializer;

class DealsByModelYearController extends BaseAPIController
{
    public function getDealsByModelYear(Request $request)
    {
        $this->validate($request, [
            'filters' => 'sometimes|required|array',
            'sort' => 'sometimes|required|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        $query = new ModelYearSearch();

        $query = $query
            ->addFeatureAggs()
            ->addMakeAndStyleAgg();

        if ($request->get('latitude') && $request->get('longitude')) {
            $query = $query->filterMustLocation(['lat' => $request->get('latitude'), 'lon' => $request->get('longitude')]);
        }

        $query = $query->genericFilters($request->get('filters', []));

        $results = $query->get();

        return fractal()
            ->item(['response' => $results,
                'meta' => [
                    'entity' => 'model',
                ]])
            ->transformWith(ESResponseTransformer::class)
            ->serializeWith(new ArraySerializer)
            ->respond();
    }
}
