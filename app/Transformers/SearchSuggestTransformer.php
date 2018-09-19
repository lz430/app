<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\JATO\Make;


class SearchSuggestTransformer extends TransformerAbstract
{

    public function transform($response)
    {
        $return = [
            'make' => [],
            'model' => [],
            'style' => [],
        ];


        foreach($response['aggregations']['makes']['data']['buckets'] as $item) {
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

        foreach($response['aggregations']['styles']['data']['buckets'] as $item) {
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
            $return['make'][] = $data;
        }
        foreach($response['aggregations']['models']['model']['data']['buckets'] as $item) {
            $data = [
                'label' => $item['key'],
                'count' => $item['doc_count'],
                'query' => [
                    'entity' => 'deal',
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
