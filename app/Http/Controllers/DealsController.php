<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends Controller
{
    public function show(int $id)
    {
        $deal = Deal::with('features')->with(['photos' => function ($query) {
            $query->orderBy('id');
        },])->findOrFail($id);

        $dealTransformed = fractal($deal)
            ->transformWith(DealTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->toJson();

        return view('deals.show')
            ->with('deal', $dealTransformed);
    }
}
