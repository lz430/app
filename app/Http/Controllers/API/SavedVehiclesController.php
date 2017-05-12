<?php

namespace App\Http\Controllers\API;

use App\Transformers\SavedVehicleTransformer;

class SavedVehiclesController extends BaseAPIController
{
    const RESOURCE_NAME = 'saved-vehicles';
    const TRANSFORMER = SavedVehicleTransformer::class;
    
    public function index()
    {
        return fractal()
            ->collection(auth()->user()->savedVehicles)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
