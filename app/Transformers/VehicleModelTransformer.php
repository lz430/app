<?php

namespace App\Transformers;

use App\Models\JATO\VehicleModel;
use League\Fractal\TransformerAbstract;

class VehicleModelTransformer extends TransformerAbstract
{
    /**
     * @param VehicleModel $model
     * @return array
     */
    public function transform(VehicleModel $model)
    {
        return [
            'id' => $model->id,
            'name' => $model->name,
            'url_name' => $model->url_name,
        ];
    }
}
