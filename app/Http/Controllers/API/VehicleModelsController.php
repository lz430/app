<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\JATO\VehicleModel;
use App\Transformers\VehicleModelTransformer;

class VehicleModelsController extends Controller
{
    private const TRANSFORMER = VehicleModelTransformer::class;
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
