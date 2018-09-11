<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends Controller
{
    public function show(Deal $deal)
    {


        $title = "$deal->year $deal->make $deal->model $deal->series";

        $dealTransformed = fractal($deal)
            ->transformWith(DealTransformer::class)
            ->serializeWith(new DataArraySerializer);

        return view('deal-detail')
            ->with('deal', $dealTransformed->toJson())
            ->with('title', $title);
    }
}
