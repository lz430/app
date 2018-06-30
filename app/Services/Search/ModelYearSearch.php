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
                            "field" => "category.title.keyword"
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
                            "year" => [
                                "reverse_nested" => (object)[],
                                "aggs" => [
                                    "year" => [
                                        "terms" => [
                                            "field" => "year.keyword"
                                        ]
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