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

class DealsController extends BaseAPIController
{
    private const TRANSFORMER = DealTransformer::class;
    private const RESOURCE_NAME = 'deals';

    public function getDeals(Request $request, Client $client)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'model_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'segment' => 'sometimes|required|string|in:Subcompact,Compact,Mid-size,Full-size',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $dealsQuery = $this->makeDealsQuery($request);
        $dealsQuery = $this->filterQueryByLocationDistance($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByFuelType($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByTransmissionType($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByFeatures($dealsQuery, $request);
        $dealsQuery = Sort::sortQuery($dealsQuery, $request->get('sort', 'price'));

        $deals = $dealsQuery->paginate(15);

        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new IlluminatePaginatorAdapter($deals))
            ->respond();
    }

    private function filterQueryByLocationDistance(Builder $query, Request $request) : Builder
    {
        if ($request->has('zipcode') && $zipcode = Zipcode::where('zipcode', $request->get('zipcode'))->first()) {
            $query->filterByLocationDistance(
                $zipcode->latitude,
                $zipcode->longitude
            );
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

    private function makeDealsQuery(Request $request) : Builder
    {
        return Deal::whereHas('dealer')->whereHas('versions', function (Builder $query) use ($request) {
            if ($request->has('body_styles')) {
                $query->filterByBodyStyle($request->get('body_styles'));
            }

            if ($request->has('segment')) {
                $query->filterBySegment($request->get('segment'));
            }

            if ($request->has('model_ids')) {
                $query->filterByModel($request->get('model_ids'));
            }

            $query->whereHas('model', function (Builder $query) use ($request) {
                if ($request->has('make_ids')) {
                    $query->filterByMake($request->get('make_ids'));
                }
            });
        })->whereNotNull('price')->whereNotNull('msrp')->with(['photos' => function ($query) {
            $query->orderBy('id');
        },])->with('features')->with('versions.equipment')->with('dealer')->forSale();
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

    private function filterQueryByFeatures(Builder $query, Request $request) : Builder
    {
        if ($request->has('features')) {
            foreach ($request->get('features') as $feature) {
                $query->whereHas('dmrFeatures', function ($subQuery) use ($feature) {
                    $subQuery->where('title', $feature);
                });
            }
        }

        return $query;
    }
}
