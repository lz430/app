<?php

namespace App\Services\Search;

class ModelYearSearch extends BaseSearch {


    public function __construct()
    {
        parent::__construct();
        $this->addAggsToQuery();
    }

    private function addAggsToQuery() {
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
                            "order" => [
                                "_key" => 'asc',
                            ],
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