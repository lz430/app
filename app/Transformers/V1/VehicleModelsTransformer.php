<?php

namespace App\Transformers\V1;

use App\JATO\VehicleModel;
use League\Fractal\TransformerAbstract;

class VehicleModelsTransformer extends TransformerAbstract
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
