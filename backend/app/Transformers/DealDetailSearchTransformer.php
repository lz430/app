<?php

namespace App\Transformers;

use DeliverMyRide\Fuel\Map;
use League\Fractal\TransformerAbstract;

class DealDetailSearchTransformer extends TransformerAbstract
{
    public function transform(array $document)
    {
        $deal = (object) $document['_source'];
        $dealer = (object) $deal->dealer;
        $version = (object) $deal->version;
        $fields = (isset($document['fields']) ? $document['fields'] : []);

        //compares feature id of color attribute to map and gets hex value back for use for swatch
        $simpleColor = isset($deal->vehicle_color) ? $deal->vehicle_color : null;

        if (is_array($simpleColor)) {
            $simpleColor = end($simpleColor);
        }

        $simpleColorSwatch = $simpleColor && isset(Map::HEX_MAP[$simpleColor]) ? Map::HEX_MAP[$simpleColor] : null;

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
            'doors' => $deal->doors,
            'transmission' => (isset($deal->transmission) ? $deal->transmission : null),
            'series' => $deal->series,
            'engine' => $deal->engine,
            'interior_color' => $deal->interior_color,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'fuel_type' => isset($deal->fuel_type) ? $deal->fuel_type : null,
            'seating_capacity' => $deal->seating_capacity,
            'drive_train' => isset($deal->drive_train) ? $deal->drive_train : null,
            'photos' => $deal->photos,
            'thumbnail' => $deal->thumbnail,
            'version' => $version,
            'seat_materials' => isset($deal->seat_materials) ? $deal->seat_materials : null,

            'options' => isset($deal->options) ? $deal->options : [],
            'packages' => isset($deal->packages) ? $deal->packages : [],
            'equipment' => isset($deal->equipment) ? $deal->equipment : [],
            'highlights' => isset($deal->highlights) ? $deal->highlights : [],
            'overview' => isset($deal->overview) ? $deal->overview : [],
            'seating_materials' => isset($deal->seating_materials) ? $deal->seating_materials : null,

            'vauto_features' => (isset($deal->misc) ? $deal->misc : []),
            'dealer' => $dealer,
            'color' => $deal->color,
            'color_simple' => $simpleColor,
            'exterior_color_swatch' => $simpleColorSwatch,
            'pricing' => $deal->pricing,
            'fees' => (isset($deal->fees) ? $deal->fees : null),
        ];
    }
}
