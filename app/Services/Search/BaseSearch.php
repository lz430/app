<?php

namespace App\Services\Search;

use App\Models\Deal;
use App\Models\JATO\Make;
use App\Models\JATO\VehicleModel;


abstract class BaseSearch
{
    private const FEATURE_TERMS = [
        'transmission' => 'transmission.keyword',
        'comfort_and_convenience' => 'comfort_and_convenience.keyword',
        'infotainment' => 'infotainment.keyword',
        'safety_and_driver_assist' => 'safety_and_driver_assist.keyword',
        'seating_configuration' => 'seating_configuration.keyword',
        'seating' => 'seating.keyword',
        'seat_materials' => 'seat_materials.keyword',
        'fuel_type' => 'fuel_type.keyword',
        'drive_train' => 'drive_train.keyword',
        'pickup' => 'pickup.keyword',
    ];

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

    public function size(int $size)
    {
        $this->query['size'] = $size;
        return $this;
    }

    public function from(int $from)
    {
        $this->query['from'] = $from;
        return $this;
    }

    public function sort(string $sort)
    {

        $direction = 'asc';
        if (substr($sort, 0, 1) === "-") {
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

    public function filterMustLocation($location)
    {
        $lat = (float)$location['lat'];
        $lon = (float)$location['lon'];

        if (!isset($lat)) {
            return $this;
        }

        if (!isset($lon)) {
            return $this;
        }

        $filterQuery = [['script' => [
            "script" => [
                "lang" => "painless",
                "source" => "(doc['location'].arcDistance(params.lat,params.lon) * 0.000621371) <  doc['max_delivery_distance'].value",
                "params" => [
                    "lat" => $lat,
                    "lon" => $lon,
                ]
            ]
        ]]];

        $this->query['query']['bool']['must'][] = $filterQuery;

        if (isset($this->query['aggs']['makeandstyle'])) {
            $this->query['aggs']['makeandstyle']['aggs']['style']['filter']['bool']['must'][] = $filterQuery;
            $this->query['aggs']['makeandstyle']['aggs']['make']['filter']['bool']['must'][] = $filterQuery;
        }

        return $this;
    }

    public function filterMustStyles(array $styles)
    {

        $filterQuery = [
            [
                'terms' => [
                    'style.keyword' => $styles,
                ],
            ]
        ];


        $this->query['query']['bool']['must'][] = $filterQuery;

        if (isset($this->query['aggs']['makeandstyle'])) {
            $this->query['aggs']['makeandstyle']['aggs']['make']['filter']['bool']['must'][] = $filterQuery;
        }

        return $this;
    }

    public function filterMustYears(array $years)
    {
        $this->query['query']['bool']['must'][] = [
            [
                'terms' => [
                    'year.keyword' => $years,
                ],
            ]
        ];

        return $this;
    }

    public function filterMustMakes(array $makes)
    {

        $filterQuery = [
            [
                'terms' => [
                    'make.keyword' => $makes,
                ],
            ]
        ];

        $this->query['query']['bool']['must'][] = $filterQuery;


        if (isset($this->query['aggs']['makeandstyle'])) {
            $this->query['aggs']['makeandstyle']['aggs']['style']['filter']['bool']['must'][] = $filterQuery;
        }

        return $this;
    }

    public function filterMustModels(array $models, $format = 'name')
    {
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

    public function filterMustCategoryFeature($category, array $features)
    {
        foreach ($features as $feature) {
            $filterQuery = [
                [
                    'term' => [
                        self::FEATURE_TERMS[$category] => $feature,
                    ],
                ]
            ];

            $this->query['query']['bool']['must'][] = $filterQuery;

            if (isset($this->query['aggs']['makeandstyle'])) {
                $this->query['aggs']['makeandstyle']['aggs']['style']['filter']['bool']['must'][] = $filterQuery;
                $this->query['aggs']['makeandstyle']['aggs']['make']['filter']['bool']['must'][] = $filterQuery;
            }
        }

        return $this;
    }



    public function genericFilters(array $filters)
    {
        $byCategory = [];

        foreach ($filters as $filter) {
            $filter = explode(":", $filter);
            if (!count($filter) == 2) {
                continue;
            }

            if (!isset($byCategory[$filter[0]])) {
                $byCategory[$filter[0]] = [];
            }

            $byCategory[$filter[0]][] = $filter[1];
        }

        if (isset($byCategory['style'])) {
            $this->filterMustStyles($byCategory['style']);
            unset($byCategory['style']);
        }

        if (isset($byCategory['make'])) {
            $this->filterMustMakes($byCategory['make']);
            unset($byCategory['make']);
        }

        if (isset($byCategory['model'])) {
            $this->filterMustModels($byCategory['model']);
            unset($byCategory['model']);
        }

        if (isset($byCategory['year'])) {
            $this->filterMustYears($byCategory['year']);
            unset($byCategory['year']);
        }

        foreach ($byCategory as $category => $values) {
            if (!isset(self::FEATURE_TERMS[$category])) {
                continue;
            }

            $this->filterMustCategoryFeature($category, $values);
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function addFeatureAggs()
    {
        foreach (self::FEATURE_TERMS as $key => $field) {
            $this->query['aggs'][$key] = [
                "terms" => [
                    "size" => 50000,
                    "field" => $field,
                    "order" => [
                        "_key" => "asc",
                    ]
                ],
            ];
        }

        return $this;
    }

    /**
     * Make and model are a little more complicated, so we handle
     * them differently.
     * @return $this
     */
    public function addMakeAndStyleAgg()
    {
        $this->query['aggs']['makeandstyle'] = [
            "global" => (object)[],
            "aggs" => [
                "make" => [
                    'aggs' => [
                        'value' => [
                            "terms" => [
                                "size" => 50000,
                                "field" => "make.keyword",
                                "order" => [
                                    "_key" => "asc",
                                ]
                            ],
                        ],
                    ]
                ],
                "style" => [
                    'aggs' => [
                        'value' => [
                            "terms" => [
                                "size" => 50000,
                                "field" => "style.keyword"
                            ],
                        ]

                    ],
                ],
            ]
        ];
        return $this;
    }


    public function get()
    {
        return Deal::searchRaw($this->query);
    }
}