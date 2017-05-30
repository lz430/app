<?php

namespace App\Http\Controllers\API;

use App\Transformers\DealTransformer;
use App\VersionDeal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use League\Fractal\Serializer\DataArraySerializer;

class DealsController extends BaseAPIController
{
    private const TRANSFORMER = DealTransformer::class;
    private const RESOURCE_NAME = 'deals';
    
    public function index(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'required|array',
            'body_styles' => 'required|array',
        ]);

        $deals = VersionDeal::whereHas('version', function ($query) {
            $query->whereIn(
                DB::raw('lower(body_style)'),
                array_map('strtolower', request('body_styles'))
            )->whereHas('model', function ($query) {
                $query->whereIn('make_id', request('make_ids'));
            });
        })->orderBy('msrp', 'asc')->get();

        if (in_array('photos', $request->get('includes'))) {
            $deals->load('photos');
        }
        
        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->parseIncludes($request->get('includes'))
            ->respond();
    }
}
