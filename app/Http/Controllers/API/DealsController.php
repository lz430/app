<?php

namespace App\Http\Controllers\API;

use App\Transformers\DealTransformer;
use App\VersionDeal;
use DeliverMyRide\JsonApi\Sort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends BaseAPIController
{
    private const TRANSFORMER = DealTransformer::class;
    private const RESOURCE_NAME = 'deals';
    
    public function getDeals(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_types' => 'sometimes|required|array',
            'sort' => 'sometimes|required|string',
        ]);
        
        $dealsQuery = $this->getQueryByMakesAndBodyStyles($request);
        $dealsQuery = $this->filterQueryByFuelTypes($dealsQuery, $request);
        $dealsQuery = Sort::sortQuery($dealsQuery, request('sort', 'price'));
        $dealsQuery = $this->eagerLoadIncludes($dealsQuery, $request);

        $deals = $dealsQuery->paginate(15);
        
        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new IlluminatePaginatorAdapter($deals))
            ->parseIncludes($request->get('includes', []))
            ->addMeta([
                'fuelTypes' => VersionDeal::allFuelTypes(),
            ])
            ->respond();
    }

    private function eagerLoadIncludes(Builder $query, Request $request) : Builder
    {
        if (in_array('photos', $request->get('includes', []))) {
            $query->with('photos');
        }

        return $query;
    }

    private function filterQueryByFuelTypes(Builder $query, Request $request) : Builder
    {
        if ($request->has('fuel_types')) {
            $query->filterByFuelType(request('fuel_types'));
        }

        return $query;
    }

    private function getQueryByMakesAndBodyStyles(Request $request) : Builder
    {
        return VersionDeal::whereHas('version', function (Builder $query) use ($request) {
            if ($request->has('body_styles')) {
                $query->filterByBodyStyle(request('body_styles'));
            }

            $query->whereHas('model', function (Builder $query) use ($request) {
                if ($request->has('make_ids')) {
                    $query->filterByMake(request('make_ids'));
                }
            });
        });
    }
}
