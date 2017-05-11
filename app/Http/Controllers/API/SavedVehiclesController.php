<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Transformers\SavedVehicleTransformer;
use Illuminate\Http\Request;

class SavedVehiclesController extends Controller
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
