<?php

namespace App\Http\Controllers\API;

use App\Services\Search\ModelYearSearch;
use Illuminate\Http\Request;

class DealsByModelYearController extends BaseAPIController
{
    public function getDealsByModelYear(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'features' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $query = new ModelYearSearch();

        if ($request->get('zipcode')) {
            $query = $query->filterMustLocation($request->get('zipcode'), 'zipcode');
        }

        if ($request->get('body_styles')) {
            $query = $query->filterMustStyles($request->get('body_styles'));
        }

        if ($request->get('make_ids')) {
            $query = $query->filterMustMakes($request->get('make_ids'), 'name');
        }

        if ($request->get('features')) {
            $query = $query->filterMustLegacyFeatures($request->get('features'));
        }

        $results = $query->get();
        return $results;
    }
}
