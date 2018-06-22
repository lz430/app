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
            'stock_number' => $deal->stock,
            'vin' => $deal->vin,
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            'model_code' => $deal->model_code,
            'body' => $deal->body,
            'transmission' => $deal->transmission,
            'series' => $deal->series,
            'door_count' => $deal->doors,
            'engine' => $deal->engine,
            'color' => $deal->color,
            'interior_color' => $deal->interior_color,
            'default_price' => $deal->pricing['default'],
            'employee_price' => $deal->pricing['employee'],
            'supplier_price' =>  $deal->pricing['supplier'],
            'msrp' => $deal->pricing['msrp'],
            'inventory_date' => $deal->inventory_date,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'dealer_name' => $dealer->name,
            'photos' => $deal->photos,
            'thumbnail' => $deal->thumbnail,
            'version' => $version,
            //'features' => $deal->jato_features,
            'doc_fee' => (float) $dealer->doc_fee,
            'cvr_fee' => (float) $dealer->cvr_fee,
            'registration_fee' => (float) $dealer->registration_fee,
            'acquisition_fee' => (float) $dealer->acquisition_fee,
            'vauto_features' => (isset($deal->misc) ? $deal->misc : []),
            'dealer' => $dealer,
            'dmr_features' => $deal->legacy_features,
            'pricing' => $deal->pricing,
        ];
    }
}
