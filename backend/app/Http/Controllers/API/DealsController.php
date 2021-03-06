<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use Illuminate\Http\Request;
use App\Services\Search\DealSearch;
use App\Services\Search\DealDetailSearch;
use App\Transformers\ESResponseTransformer;
use League\Fractal\Serializer\ArraySerializer;
use App\Transformers\DealDetailSearchTransformer;

class DealsController extends BaseAPIController
{
    public function list(Request $request)
    {
        $this->validate($request, [
            'filters' => 'sometimes|required|array',
            'sort' => 'sometimes|required|string',
            'strategy' => 'sometimes|required|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'page' => 'sometimes|integer|min:1|max:100',
        ]);

        $query = new DealSearch();

        $query = $query
            ->addFeatureAggs()
            ->addMakeAndStyleAgg()
            ->filterMustGenericRules();

        /*
        if ($request->get('latitude') && $request->get('longitude')) {
            $query = $query->filterMustLocation(['lat' => $request->get('latitude'), 'lon' => $request->get('longitude')]);
        }
        */

        if ($request->get('strategy') && in_array($request->get('strategy'), ['cash', 'finance', 'lease'])) {
            $query = $query->filterMustPayment($request->get('strategy'));
        }

        $query = $query->genericFilters($request->get('filters', []));

        if ($request->get('sort')) {
            $query = $query->sort($request->get('sort'), $request->get('strategy'));
        }

        $page = ($request->get('page') ? $request->get('page') - 1 : 0);

        $per_page = 24;

        $query = $query
            ->size($per_page)
            ->from($page * $per_page);

        $results = $query->get();

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

    public function detail(Request $request, Deal $deal)
    {
        $this->validate($request, [
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        $query = new DealDetailSearch();
        $query = $query->filterMustDealId($deal->id);

        if ($request->get('latitude') && $request->get('longitude')) {
            $query = $query->addLocationField(['lat' => $request->get('latitude'), 'lon' => $request->get('longitude')]);
        }

        $results = $query->get();
        if (isset($results['hits']['hits'][0])) {
            $response = (new DealDetailSearchTransformer())->transform($results['hits']['hits'][0]);

            return $response;
        }

        return abort(404);
    }
}
