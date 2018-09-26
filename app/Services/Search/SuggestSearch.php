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
                        'bool' => [
                            'must' => [
                                [
                                    "wildcard" => [
                                        "make" => "*" . $query . "*"
                                    ]
                                ]
                            ]
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
                    "nested" => [
                        "path" => "category"
                    ],
                    "aggs" => [
                        "model" => [
                            "filter" => [
                                'bool' => [
                                    'must' => [
                                        [
                                            "wildcard" => [
                                                "category.title" => "*" . $query . "*"
                                            ]
                                        ]
                                    ]
                                ],
                            ],
                            "aggs" => [
                                "data" => [
                                    "terms" => [
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
                        'bool' => [
                            'must' => [
                                [
                                    "wildcard" => [
                                        "style" => "*" . $query . "*"
                                    ]
                                ]
                            ]
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