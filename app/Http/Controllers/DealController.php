<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class DealController extends Controller
{
    public function show(int $id)
    {
        $deal = Deal::findOrFail($id);

        $dealTransformed = fractal($deal)
            ->transformWith(DealTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->toJson();

        return view('deals.show')
            ->with('deal', $dealTransformed);
    }
}
