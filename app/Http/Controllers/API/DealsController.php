<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\Traits\SearchesDeals;
use App\Transformers\DealTransformer;
use DeliverMyRide\JsonApi\Sort;
use Illuminate\Http\Request;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends BaseAPIController
{
    use SearchesDeals;

    private const TRANSFORMER = DealTransformer::class;
    private const RESOURCE_NAME = 'deals';

    public function getDeals(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'year' => 'sometimes|required|digits:4',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $dealsQuery = $this->buildSearchQuery($request);
        $dealsQuery = Sort::sortQuery($dealsQuery, $request->get('sort', 'price'));

        $deals = $dealsQuery->paginate(24);

        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new IlluminatePaginatorAdapter($deals))
            ->respond();
    }
}
