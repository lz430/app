<?php

namespace App\Http\Controllers\API\V1;

use App\JATO\Make;
use App\Transformers\V1\MakeTransformer;
use App\Http\Controllers\Controller;

class MakesController extends Controller
{
    private const TRANSFORMER = MakeTransformer::class;
    private const RESOURCE_NAME = 'makes';
    
    public function index()
    {
        $makes = Make::all();
        
        return fractal()
            ->collection($makes)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
