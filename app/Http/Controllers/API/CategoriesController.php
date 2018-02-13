<?php

namespace App\Http\Controllers\API;

use App\Category;
use App\Feature;
use App\Transformers\DmrCategoryTransformer;
use Illuminate\Http\Request;

class CategoriesController extends BaseAPIController
{
    private const TRANSFORMER = DmrCategoryTransformer::class;
    private const RESOURCE_NAME = 'category';
    
    public function index()
    {
        $categories = Category::has('features')->orderBy('display_order')->get();
    
        return fractal()
            ->collection($categories)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes(request('includes'))
            ->respond();
    }
}