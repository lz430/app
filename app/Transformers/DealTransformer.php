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

        //
        // Migration help
        if (!$deal->source_price) {
            $deal->source_price = (object) [
              'msrp' => $deal->msrp,
              'price' => $deal->price,
            ];
        }

        // The defaults when no rules exist.
        $prices = [
            'msrp' => $deal->source_price->msrp !== '' ? $deal->source_price->msrp : null,
            'employee' => $deal->source_price->price !== '' ? $deal->source_price->price : null,
            'supplier' => (in_array(strtolower($deal->make), Make::DOMESTIC) ?  $deal->source_price->price * 1.04 :  $deal->source_price->price)
        ];

        $dealer = $deal->dealer;
        // Dealer has some special rules
        if ($dealer->price_rules) {
            foreach ($dealer->price_rules as $attr => $field) {

                // If for whatever reason the selected base price for the field doesn't exist or it's false, we fall out
                // so the default role price is used.
                if (!isset($deal->source_price->{$field->base_field}) || !$deal->source_price->{$field->base_field}) {
                    continue;
                }

                $prices[$attr] = $deal->source_price->{$field->base_field};

                if ($field->rules) {
                    foreach ($field->rules as $rule) {
                        switch ($rule->modifier) {
                            case 'add_value':
                                $prices[$attr] += $rule->value;
                                break;
                            case 'subtract_value':
                                $prices[$attr] -= $rule->value;
                                break;
                            case 'percent':
                                $prices[$attr] = ($rule->value / 100) * $prices[$attr];
                                break;
                        }
                    }
                }
            }
        }

        return (object) array_map('floatval', $prices);
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
        ];
    }
}
