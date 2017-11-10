<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class ConfirmDetailsController extends Controller
{
    public function show(int $id)
    {
        $deal = Deal::with('features')->with(['photos' => function ($query) {
            $query->orderBy('id')->limit(7);
        },])->with('versions.equipment')->findOrFail($id);

        $title = "{$deal->year} {$deal->make} {$deal->model} {$deal->series}";

        $dealTransformed = fractal($deal)
            ->transformWith(DealTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->toJson();

        return view('confirm', ['id' => $id])
            ->with('deal', $dealTransformed)
            ->with('title', $title);
    }
}
