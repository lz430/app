<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class DealSearchTransformer extends TransformerAbstract
{

    public function transform(array $document)
    {

        $deal = (object) $document['_source'];
        $dealer = (object) $deal->dealer;
        $version = (object) $deal->version;
        return [
            'id' => $deal->id,
            //'dealer_id' => $dealer_id,
            'stock_number' => $deal->stock,
            'vin' => $deal->vin,
            //'new' => $deal->new,
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            //'model_code' => $deal->model_code,
            'body' => $deal->body,
            'transmission' => $deal->transmission,
            'series' => $deal->series,
            //'series_detail' => $deal->series_detail,
            'door_count' => $deal->doors,
            //'odometer' => $deal->odometer,
            'engine' => $deal->engine,
            //'fuel' => $deal->fuel,
            'color' => $deal->color,
            'interior_color' => $deal->interior_color,
            'default_price' => $deal->pricing['default'],
            'employee_price' => $deal->pricing['employee'],
            'supplier_price' =>  $deal->pricing['supplier'],
            'msrp' => $deal->pricing['msrp'],
            'inventory_date' => $deal->inventory_date,
            //'certified' => $deal->certified,
            //'description' => $deal->description,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'dealer_name' => $dealer->name,
            //'days_old' => $deal->days_old,
            'photos' => $deal->photos,
            'thumbnail' => $deal->thumbnail,
            'version' => $version,
            'features' => $deal->jato_features,
            'doc_fee' => (float) $dealer->doc_fee,
            'cvr_fee' => (float) $dealer->cvr_fee,
            'registration_fee' => (float) $dealer->registration_fee,
            'acquisition_fee' => (float) $dealer->acquisition_fee,
            /*
            'vauto_features' => array_values(array_diff(explode('|', $deal->vauto_features), $deal->jatoFeatures->map(function ($feature) {
                return $feature->feature;
            })->toArray())),
            */
            'vauto_features' => (isset($deal->misc) ? $deal->misc : []),
            'dealer' => $dealer,
            'dmr_features' => $deal->legacy_features,
            'pricing' => $deal->pricing,
        ];
    }
}
