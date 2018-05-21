<?php

namespace App\Http\Controllers\API;

use App\Models\JATO\Make;
use App\Transformers\MakeTransformer;

class MakesController extends BaseAPIController
{
    private const TRANSFORMER = MakeTransformer::class;
    private const RESOURCE_NAME = 'makes';

    public function index()
    {
        //$makes = Make::whiteListed()->orderBy('name')->get();
        $makes = Make::whiteListed()->whereNotIn('name', ['Aston Martin', 'MINI', 'Mitsubishi'])->orderBy('name')->get();

        return fractal()
            ->collection($makes)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes(request('includes'))
            ->respond();
    }
}
