<?php

namespace App\Http\Controllers\API;

use App\JATO\Make;
use App\Transformers\DealTransformer;
use App\VersionDeal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        
        $makes = Make::whereIn('id', request('make_ids'))->get();

        $version_ids = $makes->flatMap->versions->map(function ($version) {
            $version->body_style = strtolower($version->body_style);
            return $version;
        })->whereIn('body_style', array_map('strtolower', $request->get('body_styles')))
            ->pluck('id');

        $deals = VersionDeal::whereIn('version_id', $version_ids)->get();

        return fractal()
            ->collection($deals)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes($request->get('includes'))
            ->respond();
    }
}
