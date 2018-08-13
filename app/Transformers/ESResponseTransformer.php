<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\JATO\Make;


use DeliverMyRide\JATO\Map;

class ESResponseTransformer extends TransformerAbstract
{
    public $response = null;
    public $meta = null;

    private const SORT_SIZE_ORDER = [
        'Subcompact',
        'Compact',
        'Mid-size',
        'Full-size',
        'Mini Van',
        'Sports',
    ];

    private function transformBuckets($buckets)
    {
        $terms = [];
        foreach ($buckets as $bucket) {
            $terms[] = [
                'label' => $bucket['key'],
                'value' => $bucket['key'],
                'count' => $bucket['doc_count'],
            ];
        }

        return $terms;
    }

    private function extractFilters()
    {
        $filters = [];

        foreach ($this->response['aggregations'] as $key => $data) {
            if ($key == "makeandstyle") {
                $filters['style'] = $this->transformBuckets($data['style']['value']['buckets']);
                $filters['make'] = $this->transformBuckets($data['make']['value']['buckets']);
            } elseif (isset($data['buckets'])) {
                $filters[$key] = $this->transformBuckets($data['buckets']);
            }
        }

        return $filters;
    }

    private function transformFilters($filters)
    {
        foreach ($filters as $key => $items) {
            $transformed = [];

            switch ($key) {
                case 'style':
                    foreach ($items as $item) {
                        $value = $item['label'];
                        $data = array_merge($item, Map::BODY_STYLES[$item['label']], ['value' => $value]);
                        unset($data['style']);
                        $transformed[] = $data;
                    }
                    break;
                case 'make':
                    foreach ($items as $item) {
                        $data = $item;
                        $data['icon'] = Make::LOGOS[$item['value']];
                        $transformed[] = $data;
                    }
                    break;

                default:
                    $transformed = $items;
                    break;
            }

            $filters[$key] = $transformed;
        }

        return $filters;
    }

    private function sortFilters($filters)
    {
        if (isset($filters['vehicle_size'])) {
            $order = array_flip(self::SORT_SIZE_ORDER);

            usort($filters['vehicle_size'], function ($a, $b)  use ($order) {
                $aValue = (isset($order[$a['value']]) ? $order[$a['value']] : 100);
                $bValue = (isset($order[$b['value']]) ? $order[$b['value']] : 100);

                if ($aValue == $bValue) {
                    return 0;
                }
                return $aValue > $bValue ? 1 : -1;
            });
        }
        return $filters;
    }

    public function filters()
    {
        $filters = $this->extractFilters();
        $filters = $this->transformFilters($filters);
        $filters = $this->sortFilters($filters);

        return $filters;
    }

    public function dealRecords()
    {
        $results = [];

        foreach ($this->response['hits']['hits'] as $data) {
            $results[] = (new DealSearchTransformer())->transform($data);
        }

        return $results;
    }

    public function modelRecords()
    {
        $results = [];

        foreach ($this->response['aggregations']['category']['model']['buckets'] as $data) {
            if (count($data['year']['year']['buckets']) > 1) {
                $year = $data['year']['year']['buckets'][0]['key'];
                $last = end($data['year']['year']['buckets']);
                $year .= '-' . $last['key'];
            } else {
                $year = $data['year']['year']['buckets'][0]['key'];
            }
            $element = [
                'make' => $data['make']['make']['buckets'][0]['key'],
                'model' => $data['model']['model']['buckets'][0]['key'],
                'year' => $year,
                'thumbnail' => (object)[
                    'url' => (isset($data['thumbnail']['buckets'][0]['key']) ? $data['thumbnail']['buckets'][0]['key'] : null)
                ],
                'deals' => (object)[
                    'count' => $data['doc_count'],
                ],
                'msrp' => round($data['msrp']['min_msrp']['value'], 2),
                'cash' => round($data['cash']['min_cash']['value'], 2),
                'lease' => round($data['lease']['min_lease']['value'], 2),
                'finance' => round($data['finance']['min_finance']['value'], 2),
            ];

            $results[] = $element;
        }

        return $results;
    }

    public function meta()
    {
        $meta = [
            'entity' => $this->meta['entity'],
            'took' => $this->response['took'],
            'total' => $this->response['hits']['total'],
            'count' => count($this->response['hits']['hits']),
        ];

        if (isset($this->meta['per_page'])) {
            $meta['per_page'] = $this->meta['per_page'];
            $meta['last_page'] = ceil($this->response['hits']['total'] / $this->meta['per_page']);
        }

        if (isset($this->meta['current_page'])) {
            $meta['current_page'] = $this->meta['current_page'];
        }

        return $meta;
    }

    public function transform(array $response)
    {
        $this->response = $response['response'];
        $this->meta = $response['meta'];

        $response = [
            //'raw' => $response,
            'filters' => $this->filters(),
            'meta' => $this->meta(),
        ];

        if ($this->meta['entity'] == 'deal') {
            $response['results'] = $this->dealRecords();
        } else {
            $response['results'] = $this->modelRecords();
        }
        return $response;
    }
}
