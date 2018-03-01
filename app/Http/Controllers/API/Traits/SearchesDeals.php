<?php

namespace App\Http\Controllers\API\Traits;

use App\Deal;
use App\Zipcode;
use Illuminate\Http\Request;
use DeliverMyRide\JsonApi\Sort;
use Illuminate\Database\Eloquent\Builder;

trait SearchesDeals
{
    private function buildSearchQuery(Request $request, $rawQuery = null)
    {
        $dealsQuery = $this->makeDealsQuery($request, $rawQuery);
        $dealsQuery = $this->filterQueryByLocationDistance($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByFuelType($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByTransmissionType($dealsQuery, $request);
        $dealsQuery = $this->filterQueryByFeatures($dealsQuery, $request);

        return $dealsQuery;
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

    private function makeDealsQuery(Request $request, $rawQuery = null) : Builder
    {
        $dealsQuery = $rawQuery ?? Deal::query();

        return $dealsQuery->whereHas('dealer')->whereHas('versions', function (Builder $query) use ($request) {
            if ($request->has('body_styles')) {
                $query->filterByBodyStyle($request->get('body_styles'));
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
                $query->whereHas('features', function ($subQuery) use ($feature) {
                    $subQuery->where('title', $feature);
                });
            }
        }

        return $query;
    }
}
