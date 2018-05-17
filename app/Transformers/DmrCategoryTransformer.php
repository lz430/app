<?php

namespace App\Transformers;

use App\Models\Category;
use App\Transformers\DmrFeatureTransformer;
use League\Fractal\TransformerAbstract;

class DmrCategoryTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'features',
    ];

    public function transform(Category $category)
    {
        return [
            'id' => $category->id,
            'title' => $category->title,
            'slug' => $category->slug,
            'display_order' => $category->display_order,
        ];
    }

    public function includeFeatures(Category $category)
    {
        return $this->collection($category->features, new DmrFeatureTransformer)->setResourceKey('feature');
    }
}
