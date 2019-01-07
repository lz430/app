<?php

namespace App\Transformers;

use DeliverMyRide\Fuel\Map;
use League\Fractal\TransformerAbstract;

class DealListSearchTransformer extends TransformerAbstract
{
    public function transform(array $document)
    {
        $deal = (object) $document['_source'];
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
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            'style' => $deal->style,
            'series' => $deal->series,
            'thumbnail' => $deal->thumbnail,

            'color' => $deal->color,
            'color_simple' => $simpleColor,
            'exterior_color_swatch' => $simpleColorSwatch,
            'pricing' => $deal->pricing,

            'fees' => (isset($deal->fees) ? $deal->fees : null),
        ];
    }
}
