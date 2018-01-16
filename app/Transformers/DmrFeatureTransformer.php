<?php

namespace App\Transformers;

use App\DmrFeature;
use League\Fractal\TransformerAbstract;

class DmrFeatureTransformer extends TransformerAbstract
{
    public function transform(DmrFeature $feature)
    {
        return [
            'id'                => $feature->id,
            'title'             => $feature->title,
            'slug'              => $feature->slug,
            'display_order'     => $feature->display_order,
            'jato_schema_ids'   => $feature->jato_schema_ids,
        ];
    }
}
