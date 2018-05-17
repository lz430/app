<?php

namespace App\Http\Controllers\API;

use App\Models\Category;
use App\Models\Feature;
use App\Transformers\DmrCategoryTransformer;
use Illuminate\Http\Request;

class CategoriesController extends BaseAPIController
{
    private const TRANSFORMER = DmrCategoryTransformer::class;
    private const RESOURCE_NAME = 'category';
    
    public function index()
    {
        $categories = Category::has('features')->whereNotIn('title', ['Interior', 'Transmission'])->orderBy('display_order')->get();

        return fractal()
            ->collection($categories)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->parseIncludes(request('includes'))
            ->respond();
    }
}
