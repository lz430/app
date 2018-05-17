<?php

namespace App\Transformers;

use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;
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
