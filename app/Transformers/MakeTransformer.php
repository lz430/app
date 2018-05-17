<?php

namespace App\Transformers;

use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;
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
            'logo' => Make::LOGOS[$make->url_name] ?? '',
        ];
    }
    
    public function includeModels(Make $make)
    {
        $models = $make->models;
        
        return $this->collection(
            $models,
            new VehicleModelTransformer
        )->setResourceKey('models');
    }
}
