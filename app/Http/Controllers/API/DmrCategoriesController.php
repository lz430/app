<?php

namespace App\Http\Controllers\API;

use App\DmrCategory;
use App\Feature;
use App\Transformers\DmrCategoryTransformer;
use Illuminate\Http\Request;

class DmrCategoriesController extends BaseAPIController
{
    private const TRANSFORMER = DmrCategoryTransformer::class;
    private const RESOURCE_NAME = 'category';
    
    public function index()
    {
        $categories = DmrCategory::has('features')->orderBy('display_order')->get();
    
        return fractal()
            ->collection($categories)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes(request('includes'))
            ->respond();
    }
}
