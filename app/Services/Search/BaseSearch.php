<?php

namespace App\Services\Search;

use App\Models\Deal;
use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;


abstract class BaseSearch
{
    public $query;
    public $searchers_location;

    public function __construct()
    {
        $this->searchers_location = [];
        $this->query = [
            "query" => [
                "bool" => [
                    "must" => []
                ]
            ],
        ];
    }

    public function size(int $size) {
        $this->query['size'] = $size;
        return $this;
    }

    public function from(int $from) {
        $this->query['from'] = $from;
        return $this;
    }

    public function sort(string $sort) {

        $direction = 'asc';
        if (substr( $sort, 0, 1 ) === "-") {
            $direction = 'desc';
        }

        $sort = str_replace('-', '', $sort);

        switch ($sort) {
            case 'price':
                $sort = 'pricing.msrp';
                break;
        }

        $this->query['sort'] = [
          [
            $sort => $direction,
          ],
        ];

        return $this;
    }

    public function filterMustLocation($location, $format = 'latlon') {
        if ($format == 'latlon') {
            $lat = (float) $location['lat'];
            $lon = (float) $location['lon'];
        }

        if (!isset($lat)) {
            return $this;
        }

        if (!isset($lon)) {
            return $this;
        }

        $this->query['query']['bool']['must'][] = [['script' => [
            "script" => [
                "lang" => "painless",
                "source" => "(doc['location'].arcDistance(params.lat,params.lon) * 0.000621371) <  doc['max_delivery_distance'].value",
                "params" => [
                    "lat" => $lat,
                    "lon" => $lon,
                ]
            ]
        ]]];

        return $this;
    }

    public function filterMustStyles(array $styles) {
        $this->query['query']['bool']['must'][] = [
            [
                'terms' => [
                    'style.keyword' => $styles,
                ],
            ]
        ];

        return $this;
    }

    public function FilterMustYears(array $years) {
        $this->query['query']['bool']['must'][] = [
            [
                'terms' => [
                    'year.keyword' => $years,
                ],
            ]
        ];

        return $this;
    }

    public function filterMustMakes(array $makes, $format = 'name') {
        if ($format == 'id') {
            $makes = Make::whereIn('id', $makes)->pluck('name')->toArray();
        }

        $this->query['query']['bool']['must'][] = [
            [
                'terms' => [
                    'make.keyword' => $makes,
                ],
            ]
        ];

        return $this;
    }

    public function filterMustModels(array $models, $format = 'name') {
        if ($format == 'id') {
            $models = VehicleModel::whereIn('id', $models)->pluck('name')->toArray();
        }

        $this->query['query']['bool']['must'][] = [
            [
                'terms' => [
                    'model.keyword' => $models,
                ],
            ]
        ];

        return $this;
    }

    public function filterMustLegacyFeatures(array $features) {
        foreach($features as $feature) {
            $this->query['query']['bool']['must'][] = [
                [
                    'term' => [
                        'legacy_features.keyword' => $feature,
                    ],
                ]
            ];
        }

        return $this;
    }

    public function get() {
        return Deal::searchRaw($this->query);
    }
}