<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\JATO\Make;
use DeliverMyRide\JATO\Map;


class SearchSuggestTransformer extends TransformerAbstract
{

    public function transform($response)
    {
        $return = [
            'make' => [],
            'model' => [],
            'style' => [],
        ];

        foreach ($response['aggregations']['makes']['data']['buckets'] as $item) {
            $data = [
                'label' => $item['key'],
                'value' => $item['key'],
                'count' => $item['doc_count'],
                'icon' => Make::LOGOS[$item['key']],
                'query' => [
                    'entity' => 'model',
                    'filters' => [
                        'make:' . $item['key'],
                    ],
                ]
            ];
            $return['make'][] = $data;
        }

        foreach ($response['aggregations']['styles']['data']['buckets'] as $item) {
            $data = [
                'label' => $item['key'],
                'value' => $item['key'],
                'count' => $item['doc_count'],
                'query' => [
                    'entity' => 'model',
                    'filters' => [
                        'style:' . $item['key'],
                    ],
                ]
            ];
            $data = array_merge($item, Map::BODY_STYLES[$data['label']], $data);
            unset($data['style']);
            $return['style'][] = $data;
        }

        foreach ($response['aggregations']['models']['model']['data']['buckets'] as $item) {
            $data = [
                'label' => $item['key'],
                'count' => $item['doc_count'],
                'icon' => (isset($item['thumbnail']['buckets'][0]['key']) ? $item['thumbnail']['buckets'][0]['key'] : null),

                'query' => [
                    'entity' => 'deal',
                    // Hacky fix for frontend issues.
                    'make' => $item['make']['make']['buckets'][0]['key'],
                    'filters' => [
                        'model:' . $item['model']['model']['buckets'][0]['key'],
                        'make:' . $item['make']['make']['buckets'][0]['key'],
                    ],
                ]
            ];
            $return['model'][] = $data;
        }

        return $return;
    }
}