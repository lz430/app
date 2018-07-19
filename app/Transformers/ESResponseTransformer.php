<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\JATO\Make;


use DeliverMyRide\JATO\Manager\Maps;

class ESResponseTransformer extends TransformerAbstract
{
    public $response = null;
    public $meta = null;

    private function transformBuckets($buckets) {
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
                        $data = array_merge($item, Maps::BODY_STYLES[$item['label']], ['value' => $value]);
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

    public function filters()
    {
        $filters = $this->extractFilters();
        $filters = $this->transformFilters($filters);
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

    public function modelRecords() {
        $results = [];

        foreach ($this->response['aggregations']['category']['model']['buckets'] as $data) {
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

            $results[] = $element;
        }

        return $results;
    }

    public function meta() {
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
