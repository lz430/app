<?php

namespace App\Http\Controllers\API;

use App\JATO\Make;
use App\Transformers\MakeTransformer;

class MakesController extends BaseAPIController
{
    private const TRANSFORMER = MakeTransformer::class;
    private const RESOURCE_NAME = 'makes';
    
    public function index()
    {
        $makes = Make::whiteListed()->get();

        return fractal()
            ->collection($makes)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes(request('includes'))
            ->respond();
    }
}
