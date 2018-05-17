<?php

namespace App\Transformers;

use App\Models\DealPhoto;
use League\Fractal\TransformerAbstract;

class PhotoTransformer extends TransformerAbstract
{
    public function transform(DealPhoto $photo)
    {
        return [
            'id' => $photo->id,
            'url' => $photo->url,
        ];
    }
}
