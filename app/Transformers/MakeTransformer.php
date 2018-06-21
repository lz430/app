<?php

namespace App\Transformers;

use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;
use League\Fractal\TransformerAbstract;

class MakeTransformer extends TransformerAbstract
{

    /**
     * @param Make $make
     * @return array
     */
    public function transform($make)
    {
        return [
            'name'=> $make,
            'logo' => Make::LOGOS[$make] ?? '',
        ];
    }

}
