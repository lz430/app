<?php

namespace App\Http\Controllers\API;

use App\Transformers\BodyStyleTransformer;
use App\Models\Deal;
use DeliverMyRide\JATO\Manager\Maps;
use League\Fractal\Serializer\DataArraySerializer;

class BodyStylesController extends BaseAPIController
{
    private const TRANSFORMER = BodyStyleTransformer::class;
    private const RESOURCE_NAME = 'body-styles';

    private function getData()
    {
        $query = [
            'size' => 0,
            'aggs' => [
                "styles" => [
                    "terms" => [
                        "field" => "style.keyword",

                    ],
                ],
            ],
        ];

        $data = Deal::searchRaw($query);

        $styles = [];

        if (isset($data['aggregations']['styles']['buckets'])) {
            foreach ($data['aggregations']['styles']['buckets'] as $bucket) {
                $styles[] = $bucket['key'];
            }
        }

        return $styles;
    }

    public function index()
    {
        $data = $this->getData();
        $data = array_flip($data);
        $styles = array_intersect_key(Maps::BODY_STYLES, $data);

        return fractal()
            ->collection($styles)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->respond();
    }
}
