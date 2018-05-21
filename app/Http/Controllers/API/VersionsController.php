<?php

namespace App\Http\Controllers\API;

use App\Models\JATO\Make;
use App\Models\JATO\Version;
use App\Transformers\VersionTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;

class VersionsController extends BaseAPIController
{
    private const TRANSFORMER = VersionTransformer::class;
    private const RESOURCE_NAME = 'versions';
    
    public function index(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'required|array',
            'body_styles' => 'required|array',
        ]);

        $versions = Version::whereIn(
            DB::raw('lower(body_style)'),
            array_map('strtolower', request('body_styles'))
        )->whereHas('model', function ($query) {
            $query->whereIn('make_id', request('make_ids'));
        })->get();
    
        return fractal()
            ->collection($versions)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
