<?php

namespace App\Services\Search;

class SuggestSearch extends BaseSearch
{
    public function setSuggestQuery($query)
    {
        $query = strtolower($query);
        $this->query = [
            "size" => 0,
            "aggs" => [
                "makes" => [
                    "filter" => [
                        'match' => [
                            "search.make" => $query,
                        ],
                    ],
                    "aggs" => [
                        "data" => [
                            "terms" => [
                                "field" => "make.keyword"
                            ]
                        ]
                    ]
                ],
                "models" => [
                    "filter" => [
                        'match' => [
                            "search.model" => $query,
                        ],
                    ],
                    "aggs" => [
                        "model" => [
                            "nested" => [
                                "path" => "category"
                            ],
                            "aggs" => [
                                "data" => [
                                    "terms" => [
                                        'size' => 7,
                                        "field" => "category.title.keyword"
                                    ],
                                    "aggs" => [
                                        'thumbnail' => [
                                            'terms' => [
                                                'field' => 'category.thumbnail.keyword'
                                            ]
                                        ],
                                        'make' => [
                                            'reverse_nested' => (object)[],
                                            'aggs' => [
                                                'make' => [
                                                    'terms' => [
                                                        'field' => 'make.keyword'
                                                    ]
                                                ]
                                            ]
                                        ],
                                        'model' => [
                                            'reverse_nested' => (object)[],
                                            'aggs' => [
                                                'model' => [
                                                    'terms' => [
                                                        'field' => 'model.keyword'
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ],
                                ],

                            ]
                        ]
                    ]
                ],
                "styles" => [
                    "filter" => [
                        'match' => [
                            "search.style" => $query,
                        ],
                    ],
                    "aggs" => [
                        "data" => [
                            "terms" => [
                                "field" => "style.keyword"
                            ]
                        ]
                    ]
                ]
            ]
        ];
        return $this;
    }
}