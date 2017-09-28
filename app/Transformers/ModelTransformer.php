<?php

namespace App\Transformers;

use App\JATO\Make;
use App\JATO\VehicleModel;
use League\Fractal\TransformerAbstract;

class ModelTransformer extends TransformerAbstract
{
    public function transform(Make $make)
    {
        return [
            'id' => $make->id,
            'name'=> $make->name,
        ];
    }
}
