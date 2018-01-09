<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\DmrFeature;
use function GuzzleHttp\json_decode;

class DmrFeatureTransformer extends TransformerAbstract
{
    public function transform(DmrFeature $feature)
    {
        return [
            'id'                => $feature->id,
            'title'             => $feature->title,
            'slug'              => $feature->slug,
            'display_order'     => $feature->display_order,
            'jato_schema_ids'   => json_decode($feature->jato_schema_ids, true),
        ];
    }
}
