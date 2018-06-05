<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\Traits\SearchesDeals;
use App\Models\Deal;
use App\Models\Zipcode;
use App\Models\JATO\Make;

use Illuminate\Http\Request;


class DealsByModelYearController extends BaseAPIController
{
    use SearchesDeals;

    private function query(array $filters)
    {
        $query = [
            "query" => [
                "bool" => [
                    "must" => []
                ]
            ],
            "size" => 0,
            "aggs" => [
                "category" => [
                    "nested" => [
                        "path" => "category"
                    ],
                    "aggs" => [
                        "notes" => [
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
            ]
        ];

        if (isset($filters['location'])) {
            $query['query']['bool']['must'][] = [['script' => [
                "script" => [
                    "lang" => "painless",
                    "source" => "(doc['location'].arcDistance(params.lat,params.lon) * 0.000621371) <  doc['max_delivery_distance'].value",
                    "params" => [
                        "lat" => (float)$filters['location']['lat'],
                        "lon" => (float)$filters['location']['lon'],
                    ]
                ]
            ]]];
        }

        if (isset($filters['styles'])) {
            $query['query']['bool']['must'][] = [
                [
                    'terms' => [
                        'style.keyword' => $filters['styles'],
                    ],
                ]
            ];
        }

        if (isset($filters['makes'])) {
            $query['query']['bool']['must'][] = [
                [
                    'terms' => [
                        'make.keyword' => $filters['makes'],
                    ],
                ]
            ];
        }

        //
        if (isset($filters['features'])) {
            foreach($filters['features'] as $feature) {
                $query['query']['bool']['must'][] = [
                    [
                        'term' => [
                            'legacy_features.keyword' => $feature,
                        ],
                    ]
                ];
            }
        }

        $results = Deal::searchRaw($query);
        return $results;
    }

    private function transform($response)
    {
        $return = [];
        foreach ($response['aggregations']['category']['notes']['buckets'] as $data) {

            $element = [
                'id' => $data['id']['buckets'][0]['key'],
                'make' => $data['make']['make']['buckets'][0]['key'],
                'model' => $data['model']['model']['buckets'][0]['key'],
                'year' => $data['year']['year']['buckets'][0]['key'],
                'thumbnail' => (object)[
                    'url' => (isset($data['thumbnail']['buckets'][0]['key']) ? $data['thumbnail']['buckets'][0]['key'] : null)
                ],
                'deals' => (object)[
                    'count' => $data['doc_count'],
                ],
                'lowest_msrp' => $data['msrp']['min_msrp']['value'],
            ];
            $return[] = $element;
        }
        return $return;
    }

    public function getDealsByModelYear(Request $request)
    {
        $this->validate($request, [
            'make_ids' => 'sometimes|required|array',
            'body_styles' => 'sometimes|required|array',
            'features' => 'sometimes|required|array',
            'fuel_type' => 'sometimes|required|string',
            'transmission_type' => 'sometimes|required|string|in:automatic,manual',
            'sort' => 'sometimes|required|string',
            'zipcode' => 'sometimes|required|string',
        ]);

        $zipcode = Zipcode::where('zipcode', $request->get('zipcode'))->first();

        $filters = [];

        if ($zipcode) {
            $filters['location'] = [
                'lat' => $zipcode->latitude,
                'lon' => $zipcode->longitude,
            ];
        }

        if ($request->get('body_styles')) {
            $filters['styles'] = $request->get('body_styles');
        }

        if ($request->get('make_ids')) {
            $makes = Make::whereIn('id', $request->get('make_ids'))->pluck('name')->toArray();
            $filters['makes'] = $makes;
        }

        if ($request->get('features')) {
            $filters['features'] = $request->get('features');
        }

        $response = $this->query($filters);
        $response = $this->transform($response);
        return $response;
    }
}
