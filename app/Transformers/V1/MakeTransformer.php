<?php

namespace App\Transformers\V1;

use App\JATO\Make;
use App\JATO\VehicleModel;
use League\Fractal\TransformerAbstract;

class MakeTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'models',
    ];
    
    /**
     * @param Make $make
     * @return array
     */
    public function transform(Make $make)
    {
        return [
            'id' => $make->id,
            'name'=> $make->name,
        ];
    }
    
    public function includeModels(Make $make)
    {
        $models = $make->models;
        
        return $this->collection(
            $models,
            new VehicleModelsTransformer()
        )->setResourceKey('models');
    }
}
