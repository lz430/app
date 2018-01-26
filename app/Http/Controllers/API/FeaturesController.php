<?php

namespace App\Http\Controllers\API;

use App\JatoFeature;
use App\Transformers\FeatureTransformer;

class FeaturesController extends BaseAPIController
{
    private const TRANSFORMER = FeatureTransformer::class;
    private const RESOURCE_NAME = 'features';
    
    public function index()
    {
        return fractal()
            ->collection(JatoFeature::hasGroup()->whereIn('feature', JatoFeature::WHITELIST)->get())
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->respond();
    }
}
