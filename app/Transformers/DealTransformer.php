<?php

namespace App\Transformers;

use App\VersionDeal;
use League\Fractal\TransformerAbstract;

class DealTransformer extends TransformerAbstract
{
    public function transform(VersionDeal $deal)
    {
        return [
            'id' => $deal->id,
        ];
    }
}
