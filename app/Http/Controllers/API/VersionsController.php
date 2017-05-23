<?php

namespace App\Http\Controllers\API;

use App\JATO\Make;
use App\JATO\Version;
use App\Transformers\VersionTransformer;
use Illuminate\Http\Request;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;

class VersionsController extends BaseAPIController
{
    private const TRANSFORMER = VersionTransformer::class;
    private const RESOURCE_NAME = 'versions';
    
    public function index(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'required|string',
            'body_styles' => 'required|string',
        ]);
        
        $make_ids = explode(',', $request->get('make_ids'));
        $body_styles = explode(',', $request->get('body_styles'));
        
        // Title case body styles to correspond to casing in the versions table
        $styles = collect($body_styles)->transform(function ($body_style) {
            return ucwords($body_style);
        })->toArray();
        
        $makes = Make::whereIn('id', $make_ids)->get();
        
        $versions = $makes->flatMap->versions->whereIn('body_style', $styles)->unique();
    
        return fractal()
            ->collection($versions)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
