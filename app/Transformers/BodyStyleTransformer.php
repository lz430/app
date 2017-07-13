<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class BodyStyleTransformer extends TransformerAbstract
{
    public function transform(array $bodyStyle)
    {
        return [
            'label' => $bodyStyle['label'],
            'style' => $bodyStyle['style'],
            'icon' => $bodyStyle['icon'],
        ];
    }
}
