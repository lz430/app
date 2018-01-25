<?php

namespace App\Transformers;

use App\JatoFeature;
use League\Fractal\TransformerAbstract;

class FeatureTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(JatoFeature $feature)
    {
        return [
            'id' => $feature->id,
            'feature' => $feature->feature,
            'group' => $feature->group,
        ];
    }
}
