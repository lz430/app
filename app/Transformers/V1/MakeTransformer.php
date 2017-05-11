<?php

namespace App\Transformers\V1;

use App\JATO\Make;
use League\Fractal\TransformerAbstract;

class MakeTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Make $make)
    {
        return [
            'id' => $make->id,
            'name'=> $make->name,
        ];
    }
}
