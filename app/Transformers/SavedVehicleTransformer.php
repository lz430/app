<?php

namespace App\Transformers;

use App\SavedVehicle;
use League\Fractal\TransformerAbstract;

class SavedVehicleTransformer extends TransformerAbstract
{
    public function transform(SavedVehicle $savedVehicle)
    {
        return [
            'id' => (string) $savedVehicle->id,
            'version_id' => (string) $savedVehicle->version_id,
        ];
    }
}
