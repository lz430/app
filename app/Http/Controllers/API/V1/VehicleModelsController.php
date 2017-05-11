<?php

namespace App\Http\Controllers\API\V1;

use App\JATO\VehicleModel;
use App\Transformers\V1\VehicleModelsTransformer;
use App\Http\Controllers\Controller;

class VehicleModelsController extends Controller
{
    private const TRANSFORMER = VehicleModelsTransformer::class;
    private const RESOURCE_NAME = 'models';
    
    public function index()
    {
        $models = VehicleModel::all();
    
        return fractal()
            ->collection($models)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
