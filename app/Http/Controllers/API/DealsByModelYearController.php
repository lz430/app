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
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'features' => 'sometimes|required|array',
            'sort' => 'sometimes|required|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        $query = new ModelYearSearch();

        $query = $query
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

        if ($request->get('features')) {
            $query = $query->filterMustLegacyFeatures($request->get('features'));
        }

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
