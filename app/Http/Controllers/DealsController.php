<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends Controller
{
    public function show(int $id)
    {
        $deal = Deal::with('jatoFeatures')->has('version')->with('photos')->with('version.equipment')->findOrFail($id);

        $title = "$deal->year $deal->make $deal->model $deal->series";

        $dealTransformed = fractal($deal)
            ->transformWith(DealTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->toJson();

        return view('deals.show')
            ->with('deal', $dealTransformed)
            ->with('title', $title);
    }
}
