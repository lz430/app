<?php

namespace App\Transformers;

use App\Models\Deal;
use App\Models\Feature;
use DeliverMyRide\Fuel\Map;
use League\Fractal\TransformerAbstract;

class DealTransformer extends TransformerAbstract
{

    /**
     * @param Deal $deal
     * @return object
     */
    public function prices(Deal $deal) {
        return $deal->prices();
    }

    /**
     * @param Deal $deal
     * @return array
     */
    public function photos(Deal $deal) {
        return $deal->marketingPhotos();
    }

    public function transform(Deal $deal)
    {

        //compares feature id of color attribute to map and gets hex value back for use for swatch
        $data = null;
        foreach(Map::COLOR_MAP as $needle => $value) {
            if($deal->color == $needle) {
                $data = $value;
            }
        }
        $featureColor = Feature::where('title', $data)->first();
        $exteriorColor = null;
        foreach(Map::HEX_MAP as $color => $value){
            if(isset($featureColor) && $featureColor->title == $color){
                $exteriorColor = $value;
            }
        }

        $photos = $this->photos($deal);
        $prices = $this->prices($deal);
        return [
            'id' => $deal->id,
            'title' => $deal->title(),
            'dealer_id' => $deal->dealer_id,
            'stock_number' => $deal->stock_number,
            'year' => $deal->year,
            'make' => $deal->make,
            'model' => $deal->model,
            'transmission' => $deal->transmission,
            'series' => $deal->series,
            'series_detail' => $deal->series_detail,
            'engine' => $deal->engine,
            'fuel' => $deal->fuel,
            'color' => $deal->color,
            'interior_color' => $deal->interior_color,
            'fuel_econ_city' => $deal->fuel_econ_city,
            'fuel_econ_hwy' => $deal->fuel_econ_hwy,
            'photos' => $photos,
            'thumbnail' => $deal->featuredPhoto(),
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
            'dmr_features' => ($deal->features ? $deal->features : []),
            'pricing' => $prices,
            'exterior_color_swatch' => $exteriorColor,
        ];
    }
}
