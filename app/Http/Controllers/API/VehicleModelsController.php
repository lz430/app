<?php

namespace App\Http\Controllers\API;

use App\Models\JATO\VehicleModel;
use App\Transformers\VehicleModelTransformer;

class VehicleModelsController extends BaseAPIController
{
    private const TRANSFORMER = VehicleModelTransformer::class;
    private const RESOURCE_NAME = 'models';
    
    public function index()
    {
        $models = VehicleModel::orderBy('name')->get();
    
        return fractal()
            ->collection($models)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
