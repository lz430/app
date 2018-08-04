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
        $fields = (isset($document['fields']) ? $document['fields'] : []);

        unset($version->jato_vehicle_id);
        unset($version->created_at);
        unset($version->model_id);
        unset($version->updated_at);
        unset($version->jato_model_id);
        unset($version->delivery_price);
        unset($version->is_current);

        unset($dealer->contact_email);
        unset($dealer->address);
        unset($dealer->city);
        unset($dealer->phone);
        unset($dealer->contact_title);
        unset($dealer->contact_name);
        unset($dealer->updated_at);
        unset($dealer->created_at);

        return [
            'id' => $deal->id,
            'is_active' => $deal->is_active,
            'is_in_range' => (isset($fields['in_range'][0]) ? $fields['in_range'][0] : false),
            'title' => $deal->title,
            'stock_number' => $deal->stock,
            'vin' => $deal->vin,
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            'style' => $deal->style,
            'transmission' => $deal->transmission,
            'series' => $deal->series,
            'engine' => $deal->engine,
            'color' => $deal->color,
            'interior_color' => $deal->interior_color,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'photos' => $deal->photos,
            'thumbnail' => $deal->thumbnail,
            'version' => $version,
            'features' => (isset($deal->jato_features) ? $deal->jato_features : []),
            'doc_fee' => (float) $dealer->doc_fee,
            'cvr_fee' => (float) $dealer->cvr_fee,
            'registration_fee' => (float) $dealer->registration_fee,
            'acquisition_fee' => (float) $dealer->acquisition_fee,
            'vauto_features' => (isset($deal->misc) ? $deal->misc : []),
            'dealer' => $dealer,
            'dmr_features' => (isset($deal->legacy_features) ? $deal->legacy_features : []),

            'pricing' => $deal->pricing,
        ];
    }
}
