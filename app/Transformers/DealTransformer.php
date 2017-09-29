<?php

namespace App\Transformers;

use App\Deal;
use App\JATO\Make;
use League\Fractal\TransformerAbstract;

class DealTransformer extends TransformerAbstract
{
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
            'employee_price' => (float) (in_array(strtolower($deal->make), Make::DOMESTIC) ? $deal->price : $deal->price - ($deal->price * 0.04)),
            'supplier_price' =>  (float) (in_array(strtolower($deal->make), Make::DOMESTIC) ? $deal->price + ($deal->price * 0.04) : $deal->price),
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
            'doc_fee' => (float) $deal->dealer->doc_fee,
            'vauto_features' => array_values(array_diff(explode('|', $deal->vauto_features), $deal->features->map(function ($feature) {
                return $feature->feature;
            })->toArray())),
            'dealer' => $deal->dealer,
        ];
    }
}
