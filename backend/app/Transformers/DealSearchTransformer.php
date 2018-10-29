<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use DeliverMyRide\Fuel\Map;
use App\Models\Feature;
use DB;

class DealSearchTransformer extends TransformerAbstract
{

    public function transform(array $document)
    {
        $deal = (object)$document['_source'];
        $dealer = (object)$deal->dealer;
        $version = (object)$deal->version;
        $fields = (isset($document['fields']) ? $document['fields'] : []);

        //compares feature id of color attribute to map and gets hex value back for use for swatch
        $simpleColor = isset($deal->vehicle_color) ? $deal->vehicle_color : null;
        $simpleColorSwatch =  $simpleColor && isset(Map::HEX_MAP[$simpleColor]) ? Map::HEX_MAP[$simpleColor] : null;

        return [
            'id' => $deal->id,
            'status' => $deal->status,
            'is_in_range' => (isset($fields['in_range'][0]) ? $fields['in_range'][0] : false),
            'title' => $deal->title,
            'stock_number' => $deal->stock,
            'vin' => $deal->vin,
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            'style' => $deal->style,
            'transmission' => (isset($deal->transmission) ? $deal->transmission : null),
            'series' => $deal->series,
            'engine' => $deal->engine,
            'interior_color' => $deal->interior_color,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'photos' => $deal->photos,
            'thumbnail' => $deal->thumbnail,
            'version' => $version,
            'features' => (isset($deal->jato_features) ? $deal->jato_features : []),

            'vauto_features' => (isset($deal->misc) ? $deal->misc : []),
            'dealer' => $dealer,
            'dmr_features' => (isset($deal->legacy_features) ? $deal->legacy_features : []),
            'color' => $deal->color,
            'color_simple' => $simpleColor,
            'exterior_color_swatch' => $simpleColorSwatch,
            'pricing' => $deal->pricing,
            'fees' => (isset($deal->fees) ?  $deal->fees : null),


            // TODO: refactor frontend to use the fees values instead.
            'doc_fee' => (float)$dealer->doc_fee,
            'cvr_fee' => (float)$dealer->cvr_fee,
            'registration_fee' => (float)$dealer->registration_fee,
            'acquisition_fee' => (float)$dealer->acquisition_fee,
        ];
    }
}
