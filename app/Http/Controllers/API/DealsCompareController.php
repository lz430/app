<?php

namespace App\Http\Controllers\API;

use App\Services\Search\ESPaginatorAdapter;
use App\Transformers\DealSearchTransformer;
use App\Models\Deal;
use Illuminate\Http\Request;


use League\Fractal\Serializer\DataArraySerializer;

class DealsCompareController extends BaseAPIController
{
    private const RESOURCE_NAME = 'deals';

    public function compare(Request $request)
    {

        $this->validate($request, [
            'deals' => 'required|array',
            'deals.*' => 'integer'
        ]);

        $dealIds = $request->get('deals');

        $deals = Deal::whereIn('id', $dealIds)->get();

        return response()->json($deals);

        return fractal()
            ->collection($documents)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(DealSearchTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->paginateWith(new ESPaginatorAdapter($results, $page, $per_page))
            ->respond();
    }
}
