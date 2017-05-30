<?php

namespace App\Transformers;

use App\VersionDealPhoto;
use League\Fractal\TransformerAbstract;

class PhotoTransformer extends TransformerAbstract
{
    public function transform(VersionDealPhoto $photo)
    {
        return [
            'id' => $photo->id,
            'url' => $photo->url,
        ];
    }
}
