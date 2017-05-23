<?php

namespace App\Transformers;

use App\JATO\Equipment;
use App\JATO\Version;
use League\Fractal\TransformerAbstract;

class VersionTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'equipment',
    ];
    
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Version $version)
    {
        return [
            'id' => $version->id,
            'year' => $version->year,
            'name' => $version->name,
            'trim_name' => $version->trim_name,
            'description' => $version->description,
            'driven_wheels' => $version->driven_wheels,
            'doors' => $version->doors,
            'transmission_type' => $version->transmission_type,
            'msrp' => $version->msrp,
            'invoice' => $version->invoice,
            'body_style' => $version->body_style,
            'photo_path' => $version->photo_path,
            'fuel_econ_city' => $version->fuel_econ_city,
            'fuel_econ_hwy' => $version->fuel_econ_hwy,
            'manufacturer_code' => $version->manufacturer_code,
            'delivery_price' => $version->delivery_price,
            'is_current' => $version->is_current,
        ];
    }
    
    public function includeEquipment(Version $version)
    {
        $equipment = $version->equipment;
        
        return $this->collection($equipment, new EquipmentTransformer)
                    ->setResourceKey('equipment');
    }
}
