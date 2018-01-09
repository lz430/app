<?php

namespace App\Transformers;

use App\DmrCategory;
use League\Fractal\TransformerAbstract;
use App\Transformers\DmrFeatureTransformer;

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
            'select_one_dmr_feature'    => $category->select_one_dmr_feature,
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
