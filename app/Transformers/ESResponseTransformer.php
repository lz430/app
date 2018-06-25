<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\JATO\Make;


use DeliverMyRide\JATO\Manager\Maps;

class ESResponseTransformer extends TransformerAbstract
{
    public $response = null;
    public $meta = null;

    private function extractFilters()
    {
        $filters = [];

        foreach ($this->response['aggregations'] as $key => $data) {
            $filter = [];

            if (isset($data['sub'])) {
                $buckets = $data['sub']['buckets'];
            } else {
                $buckets = $data['buckets'];
            }

            foreach ($buckets as $bucket) {
                $filter[] = [
                    'label' => $bucket['key'],
                    'value' => $bucket['key'],
                    'count' => $bucket['doc_count'],
                ];
            }
            $filters[$key] = $filter;
        }

        return $filters;
    }

    private function transformFilters($filters)
    {
        foreach ($filters as $key => $items) {
            $transformed = [];

            switch ($key) {
                case 'bodystyle':
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

    public function records()
    {
        $results = [];

        foreach ($this->response['hits']['hits'] as $data) {
            $results[] = (new DealSearchTransformer())->transform($data);
        }

        return $results;
    }

    public function meta() {
        $meta = [
            'took' => $this->response['took'],
            'total' => $this->response['hits']['total'],
            'current_page' => $this->meta['current_page'],
            'last_page' => ceil($this->response['hits']['total'] / $this->meta['per_page']),
            'per_page' => $this->meta['per_page'],
            'count' => count($this->response['hits']['hits']),
        ];

        return $meta;
    }

    public function transform(array $response)
    {
        $this->response = $response['response'];

        $this->meta = $response['meta'];

        $response = [
            //'raw' => $response,
            'results' => $this->records(),
            'filters' => $this->filters(),
            'meta' => $this->meta(),
        ];
        return $response;
    }
}
