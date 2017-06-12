<?php

namespace App\Transformers;

use App\Feature;
use League\Fractal\TransformerAbstract;

class FeatureTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Feature $feature)
    {
        return [
            'id' => $feature->id,
            'feature' => $feature->feature,
            'group' => $feature->group,
        ];
    }
}
