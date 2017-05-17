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
        $fractal = fractal();
        
        if ($request->has('ids')) {
            $versions = Version::whereIn('id', explode(',', $request->get('ids')))->get();
        } else {
            $paginator = Version::paginate(20);
            $versions = $paginator->getCollection();
            $fractal->paginateWith(new IlluminatePaginatorAdapter($paginator));
        }
        
        return $fractal->collection($versions)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes($request->get('includes'))->respond();
    }
}
