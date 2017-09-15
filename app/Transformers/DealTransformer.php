<?php

namespace App\Transformers;

use App\Deal;
use League\Fractal\TransformerAbstract;

class DealTransformer extends TransformerAbstract
{
    protected $availableIncludes = [
        'features',
        'versions',
    ];
    
    public function transform(Deal $deal)
    {
        $deal->photos->shift();
        return [
            'id' => $deal->id,
            'file_hash' => $deal->file_hash,
            'dealer_id' => $deal->dealer_id,
            'stock_number' => $deal->stock_number,
            'vin' => $deal->vin,
            'new' => $deal->new,
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            'model_code' => $deal->model_code,
            'body' => $deal->body,
            'transmission' => $deal->transmission,
            'series' => $deal->series,
            'series_detail' => $deal->series_detail,
            'door_count' => $deal->door_count,
            'odometer' => $deal->odometer,
            'engine' => $deal->engine,
            'fuel' => $deal->fuel,
            'color' => $deal->color,
            'interior_color' => $deal->interior_color,
            'price' => (float) $deal->price,
            'msrp' => (float) $deal->msrp,
            'inventory_date' => $deal->inventory_date,
            'certified' => $deal->certified,
            'description' => $deal->description,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'dealer_name' => $deal->dealer_name,
            'days_old' => $deal->days_old,
            'photos' => $deal->photos,
            'versions' => $deal->versions,
            'features' => $deal->features,
            'vauto_features' => explode('|', $deal->vauto_features),
        ];
    }
    
    public function includeVersions(Deal $deal)
    {
        return $this->item($deal->version, new VersionTransformer)
            ->setResourceKey('versions');
    }
    
    public function includeFeatures(Deal $deal)
    {
        return $this->collection($deal->features, new FeatureTransformer)
            ->setResourceKey('features');
    }
}
