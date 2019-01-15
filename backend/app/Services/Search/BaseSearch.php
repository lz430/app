<?php

namespace App\Services\Search;

use App\Models\Deal;
use App\Models\JATO\VehicleModel;

abstract class BaseSearch
{
    private const MODEL_BLACKLIST = [
        'RDX',
        'Fit',
        'Ridgeline',
    ];

    /* TODO: Are these unique? */
    private const VERSION_DESCRIPTION_BLACKLIST = [
        'Honda Civic Si Coupe',
        'Honda Civic Si Sedan',
        'Honda Civic Hatchback Type-R Touring',
        'Honda Pilot 4WD Touring Sport Utility Vehicle',
    ];

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
        'year' => 'year.keyword',
        'seating_capacity' => 'seating_capacity',
        'vehicle_color' => 'vehicle_color.keyword',
        'vehicle_size' => 'vehicle_size.keyword',
    ];

    protected const REQUIRED_RULES = [
        'must' => [
            [['script' => [
                'script' => [
                    'lang' => 'painless',
                    'source' => "doc['pricing.msrp'].value >= doc['pricing.default'].value",
                ],
            ]]],
            [
                'exists' => [
                    'field' => 'thumbnail', ],
            ],
            ['range' => [
                'pricing.default' => [
                    'lte' => '200000',
                ],
            ]],
            ['range' => [
                'pricing.default' => [
                    'gte' => '10000',
                ],
            ]],
            ['term' => [
                'dealer.is_active' => 1,
            ]],
            ['term' => [
                'status' => 'available',
            ]],
            ['term' => [
                'price_validation.isPricingValid' => true,
            ]],
        ],
        'must_not' => [
            ['terms' => [
                'model.keyword' => self::MODEL_BLACKLIST,
            ]],
            ['terms' => [
                'version.description' => self::VERSION_DESCRIPTION_BLACKLIST,
            ]],
            ['term' => [
                'seating_capacity' => 0,
            ]],
        ],
    ];

    public $query;
    public $searchers_location;

    public function __construct()
    {
        $this->searchers_location = [];
        $this->query = [
            'query' => [
                'bool' => [
                    'must' => [],
                ],
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

    public function getSort(string $sort, string $modifier = null)
    {
        $direction = 'asc';
        if (substr($sort, 0, 1) === '-') {
            $direction = 'desc';
        }

        $sort = str_replace('-', '', $sort);

        switch ($sort) {
            case 'title':
                $sort = 'title.keyword';
                break;
            case 'price':
                if (! $modifier || ! in_array($modifier, ['msrp', 'employee', 'supplier', 'default'])) {
                    $sort = 'pricing.msrp';
                } else {
                    $sort = 'pricing.'.$modifier;
                }
                break;

            case 'payment':
                if (! $modifier || ! in_array($modifier, ['cash', 'finance', 'lease'])) {
                    $sort = 'payments.detroit.cash.payment';
                } else {
                    $sort = 'payments.detroit.'.$modifier.'.payment';
                }
                break;
        }

        return [$sort, $direction];
    }

    public function filterMustGenericRules()
    {
        foreach (self::REQUIRED_RULES as $group => $rules) {
            foreach ($rules as $rule) {
                $this->query['query']['bool'][$group][] = $rule;

                if (isset($this->query['aggs']['makeandstyle'])) {
                    $this->query['aggs']['makeandstyle']['aggs']['style']['filter']['bool'][$group][] = $rule;
                    $this->query['aggs']['makeandstyle']['aggs']['make']['filter']['bool'][$group][] = $rule;
                }
            }
        }

        return $this;
    }

    public function filterMustLocation($location)
    {
        $lat = (float) $location['lat'];
        $lon = (float) $location['lon'];

        if (! isset($lat)) {
            return $this;
        }

        if (! isset($lon)) {
            return $this;
        }

        $filterQuery = [['script' => [
            'script' => [
                'lang' => 'painless',
                'source' => "(doc['location'].arcDistance(params.lat,params.lon) * 0.000621371) <  doc['max_delivery_distance'].value",
                'params' => [
                    'lat' => $lat,
                    'lon' => $lon,
                ],
            ],
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
            ],
        ];

        $this->query['query']['bool']['must'][] = $filterQuery;

        if (isset($this->query['aggs']['makeandstyle'])) {
            $this->query['aggs']['makeandstyle']['aggs']['make']['filter']['bool']['must'][] = $filterQuery;
        }

        return $this;
    }

    public function filterMustPayment(string $strategy)
    {
        $filterQuery = [
            [
                'range' => [
                    'payments.detroit.'.$strategy.'.payment' => [
                        'gte' => 1,
                    ],
                ],
            ],
        ];
        $this->query['query']['bool']['must'][] = $filterQuery;
        if (isset($this->query['aggs']['makeandstyle'])) {
            $this->query['aggs']['makeandstyle']['aggs']['style']['filter']['bool']['must'][] = $filterQuery;
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
            ],
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
            ],
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
            ],
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
                ],
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
            $filter = str_replace('%3A', ':', $filter);
            $filter = explode(':', $filter);
            if (count($filter) !== 2) {
                continue;
            }

            if (! isset($byCategory[$filter[0]])) {
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
            if (! isset(self::FEATURE_TERMS[$category])) {
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
                'terms' => [
                    'size' => 5000,
                    'field' => $field,
                    'order' => [
                        '_key' => ($key === 'year' ? 'desc' : 'asc'),
                    ],
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
            'global' => (object) [],
            'aggs' => [
                'make' => [
                    'aggs' => [
                        'value' => [
                            'terms' => [
                                'size' => 5000,
                                'field' => 'make.keyword',
                                'order' => [
                                    '_key' => 'asc',
                                ],
                            ],
                        ],
                    ],
                ],
                'style' => [
                    'aggs' => [
                        'value' => [
                            'terms' => [
                                'size' => 5000,
                                'field' => 'style.keyword',
                            ],
                        ],

                    ],
                ],
            ],
        ];

        return $this;
    }

    public function get()
    {
        return Deal::searchRaw($this->query);
    }
}
