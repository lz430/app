<?php

namespace App\Http\Controllers;

use App\Deal;
use App\Transformers\DealTransformer;
use League\Fractal\Serializer\DataArraySerializer;

class CompareController extends Controller
{
    public function index()
    {
        $this->validate(request(), [
           'deals' => 'required|array|exists:deals,id',
        ]);

        $deals = Deal::whereIn('id', request('deals'))->with(
            'photos',
            'versions.incentives'
        )->get();
    
        $dealsTransformed = fractal()
            ->collection($deals)
            ->transformWith(DealTransformer::class)
            ->serializeWith(new DataArraySerializer)
            ->toJson();

        return view('compare')->with('deals', $dealsTransformed);
    }
}
