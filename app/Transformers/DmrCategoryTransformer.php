<?php

namespace App\Transformers;

use App\DmrCategory;
use App\Transformers\DmrFeatureTransformer;
use League\Fractal\TransformerAbstract;

class DmrCategoryTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'features',
    ];

    public function transform(DmrCategory $category)
    {
        return [
            'id'                        => $category->id,
            'title'                     => $category->title,
            'slug'                      => $category->slug,
            'display_order'             => $category->display_order,
        ];
    }

    public function includeFeatures(DmrCategory $category)
    {
        $features = $category->features;

        return $this->collection(
            $features,
            new DmrFeatureTransformer
        )->setResourceKey('feature');
    }
}
