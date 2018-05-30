<?php

namespace App\Transformers;

use App\Models\Deal;
use App\Models\JATO\Make;
use League\Fractal\TransformerAbstract;

class DealTransformer extends TransformerAbstract
{

    /**
     * @param Deal $deal
     * Generate Pricing
     */
    public function prices(Deal $deal) {
        return $deal->prices();
    }

    public function transform(Deal $deal)
    {
        $deal->photos->shift();

        $prices = $this->prices($deal);
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
            'default_price' => $prices->default,
            'employee_price' => $prices->employee,
            'supplier_price' =>  $prices->supplier,
            'msrp' => $prices->msrp,
            'inventory_date' => $deal->inventory_date,
            'certified' => $deal->certified,
            'description' => $deal->description,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'dealer_name' => $deal->dealer_name,
            'days_old' => $deal->days_old,
            'photos' => $deal->photos,
            'version' => $deal->version,
            'features' => $deal->jatoFeatures,
            'doc_fee' => (float) $deal->dealer->doc_fee,
            'cvr_fee' => (float) $deal->dealer->cvr_fee,
            'registration_fee' => (float) $deal->dealer->registration_fee,
            'acquisition_fee' => (float) $deal->dealer->acquisition_fee,
            'vauto_features' => array_values(array_diff(explode('|', $deal->vauto_features), $deal->jatoFeatures->map(function ($feature) {
                return $feature->feature;
            })->toArray())),
            'dealer' => $deal->dealer,
            'dmr_features' => $deal->features,
            'pricing' => $prices,
        ];
    }
}
