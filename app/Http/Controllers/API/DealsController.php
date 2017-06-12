<?php

namespace App\Http\Controllers\API;

use App\Transformers\DealTransformer;
use App\VersionDeal;
use DeliverMyRide\JsonApi\Sort;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
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
            'fuel_type' => 'sometimes|required|string',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
        ]);
        
        $dealsQuery = $this->getQueryByMakesAndBodyStyles($request);
        $dealsQuery = $this->filterQueryByFuelType($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByTransmissionType($dealsQuery, $request);
        $dealsQuery = Sort::sortQuery($dealsQuery, $request->get('sort', 'price'));
        $dealsQuery = $this->eagerLoadIncludes($dealsQuery, $request);

        $deals = $dealsQuery->paginate(15);
        
        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new IlluminatePaginatorAdapter($deals))
            ->parseIncludes(implode(',', $request->get('includes', [])))
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
    
        if (in_array('features', $request->get('includes', []))) {
            $query->with('features');
        }

        return $query;
    }

    private function filterQueryByFuelType(Builder $query, Request $request) : Builder
    {
        if ($request->has('fuel_type')) {
            $query->filterByFuelType($request->get('fuel_type'));
        }

        return $query;
    }

    private function getQueryByMakesAndBodyStyles(Request $request) : Builder
    {
        return VersionDeal::whereHas('version', function (Builder $query) use ($request) {
            if ($request->has('body_styles')) {
                $query->filterByBodyStyle($request->get('body_styles'));
            }

            $query->whereHas('model', function (Builder $query) use ($request) {
                if ($request->has('make_ids')) {
                    $query->filterByMake($request->get('make_ids'));
                }
            });
        });
    }

    private function filterQueryByTransmissionType(Builder $query, Request $request) : Builder
    {
        if ($request->has('transmission_type')) {
            $request->get('transmission_type') === 'manual'
                ? $query->filterByManualTransmission()
                : $query->filterByAutomaticTransmission();
        }

        return $query;
    }
}
