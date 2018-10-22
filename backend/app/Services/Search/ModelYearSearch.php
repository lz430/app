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
            'pricing.msrp' => 'msrp.min',
            'payments.detroit.cash.payment' => 'sort_cash.min',
            'payments.detroit.finance.payment' => 'sort_finance.min',
            'payments.detroit.lease.payment' => 'sort_lease.min',
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
            'category' => [
                'nested' => [
                    'path' => 'category'
                ],
                'aggs' => [
                    'model' => [
                        'terms' => [
                            'size' => 5000,
                            'field' => 'category.title.keyword',
                        ],

                        'aggs' => [
                            'thumbnail' => [
                                'terms' => [
                                    'field' => 'category.thumbnail.keyword'
                                ]
                            ],
                            'id' => [
                                'terms' => [
                                    'field' => 'category.id'
                                ]
                            ],
                            /**
                             * TODO: Why can't we sort on the existing aggs?
                             */
                            'sort_cash' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'min' => [
                                        'min' => [
                                            'field' => 'payments.detroit.cash.payment',
                                        ],
                                    ],
                                ]
                            ],
                            'sort_finance' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'min' => [
                                        'min' => [
                                            'field' => 'payments.detroit.finance.payment',
                                        ],
                                    ],
                                ]
                            ],
                            'sort_lease' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'min' => [
                                        'min' => [
                                            'field' => 'payments.detroit.lease.payment',
                                        ],
                                    ],
                                ]
                            ],
                            'cash' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'payment' => [
                                        'terms' => [
                                            'field' => 'id',
                                            'size' => 1,
                                            'order' => [
                                                'payment' => 'asc',
                                            ],
                                        ],
                                        'aggs' => [
                                            'payment' => [
                                                'min' => [
                                                    'field' => 'payments.detroit.cash.payment',
                                                ],
                                            ],
                                            'down' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.cash.down'
                                                ]
                                            ],
                                            'rebate' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.cash.rebate'
                                                ]
                                            ],
                                            'term' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.cash.term'
                                                ]
                                            ],
                                            'rate' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.cash.rate'
                                                ]
                                            ],
                                        ]
                                    ],
                                ],
                            ],

                            'finance' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'payment' => [
                                        'terms' => [
                                            'field' => 'id',
                                            'size' => 1,
                                            'order' => [
                                                'payment' => 'asc',
                                            ],
                                        ],
                                        'aggs' => [
                                            'payment' => [
                                                'min' => [
                                                    'field' => 'payments.detroit.finance.payment',
                                                ],
                                            ],
                                            'down' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.finance.down'
                                                ]
                                            ],
                                            'rebate' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.finance.rebate'
                                                ]
                                            ],
                                            'term' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.finance.term'
                                                ]
                                            ],
                                            'rate' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.finance.rate'
                                                ]
                                            ],
                                        ]
                                    ],
                                ],
                            ],

                            'lease' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'payment' => [
                                        'terms' => [
                                            'field' => 'id',
                                            'size' => 1,
                                            'order' => [
                                                'payment' => 'asc',
                                            ],
                                        ],
                                        'aggs' => [
                                            'payment' => [
                                                'min' => [
                                                    'field' => 'payments.detroit.lease.payment',
                                                ],
                                            ],
                                            'down' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.lease.down'
                                                ]
                                            ],
                                            'rebate' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.lease.rebate'
                                                ]
                                            ],
                                            'term' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.lease.term'
                                                ]
                                            ],
                                            'rate' => [
                                                'terms' => [
                                                    'field' => 'payments.detroit.lease.rate'
                                                ]
                                            ],
                                        ]
                                    ],
                                ],
                            ],

                            'msrp' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'min' => [
                                        'min' => [
                                            'field' => 'pricing.msrp'
                                        ]
                                    ],
                                ]
                            ],


                            'year' => [
                                'reverse_nested' => (object)[],
                                'aggs' => [
                                    'year' => [
                                        'terms' => [
                                            'field' => 'year.keyword',
                                            'order' => [
                                                '_key' => 'asc',
                                            ],
                                        ],
                                    ]
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
                        ]
                    ]
                ]
            ]
        ];
        return $this;
    }

}