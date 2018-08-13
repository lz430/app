<?php

namespace App\Services\Search;

class ModelYearSearch extends BaseSearch
{


    public function __construct()
    {
        parent::__construct();
        $this->addAggsToQuery();
    }

    public function sort(string $sort, string $modifier = null)
    {
        list($sort, $direction) = $this->getSort($sort, $modifier);

        $map = [
            'pricing.msrp' => 'msrp.min_msrp',
            'payments.detroit.cash' => 'cash.min_cash',
            'payments.detroit.finance' => 'finance.min_finance',
            'payments.detroit.lease' => 'lease.min_lease',
        ];

        if (isset($map[$sort])) {
            $this->query['aggs']['category']['aggs']['model']['aggs']['category_sort'] = [
                'bucket_sort' => [
                    'sort' => [
                        [$map[$sort] => ['order' => $direction]],
                    ]
                ],
            ];
        } else {
            $this->query['aggs']['category']['aggs']['model']['terms']['order'] = [
                '_key' => $direction
            ];
        }
        return $this;
    }

    private function addAggsToQuery()
    {
        $this->query['size'] = 0;
        $this->query['aggs'] = [
            "category" => [
                "nested" => [
                    "path" => "category"
                ],
                "aggs" => [
                    "model" => [
                        "terms" => [
                            "size" => 50000,
                            "field" => "category.title.keyword",
                        ],

                        "aggs" => [
                            "thumbnail" => [
                                "terms" => [
                                    "field" => "category.thumbnail.keyword"
                                ]
                            ],
                            "id" => [
                                "terms" => [
                                    "field" => "category.id"
                                ]
                            ],
                            "msrp" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "min_msrp" => [
                                        "min" => [
                                            "field" => "pricing.msrp"
                                        ]
                                    ]
                                ]
                            ],
                            "cash" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "min_cash" => [
                                        "min" => [
                                            "field" => "payments.detroit.cash"
                                        ]
                                    ]
                                ]
                            ],
                            "finance" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "min_finance" => [
                                        "min" => [
                                            "field" => "payments.detroit.finance"
                                        ]
                                    ]
                                ]
                            ],
                            "lease" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "min_lease" => [
                                        "min" => [
                                            "field" => "payments.detroit.lease"
                                        ]
                                    ]
                                ]
                            ],
                            "year" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "year" => [
                                        "terms" => [
                                            "field" => "year.keyword",
                                            "order" => [
                                                "_key" => 'asc',
                                            ],
                                        ],
                                    ]
                                ]
                            ],
                            "make" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "make" => [
                                        "terms" => [
                                            "field" => "make.keyword"
                                        ]
                                    ]
                                ]
                            ],
                            "model" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "model" => [
                                        "terms" => [
                                            "field" => "model.keyword"
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
        return $this;
    }

}