<?php

namespace App\Transformers;

use App\Deal;
use League\Fractal\TransformerAbstract;

class RebateTransformer extends TransformerAbstract
{
    public function transform(array $rebate)
    {
        return [
            'id' => $rebate['id'],
            'rebate' => $rebate['rebate'],
            'value' => $rebate['value'],
        ];
    }
}
