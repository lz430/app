<?php

namespace App\Http\Controllers\API;

use App\Models\Deal;
use App\Transformers\MakeTransformer;
use League\Fractal\Serializer\DataArraySerializer;


class MakesController extends BaseAPIController
{
    private const TRANSFORMER = MakeTransformer::class;
    private const RESOURCE_NAME = 'makes';

    private function getData()
    {
        $query = [
            'size' => 0,
            'aggs' => [
                "makes" => [
                    "terms" => [
                        "size" => 5000,
                        "field" => "make.keyword",
                        "order" => [
                            "_key" =>  "asc"
                        ],
                    ],
                ],
            ],
        ];

        $data = Deal::searchRaw($query);

        $makes = [];

        if (isset($data['aggregations']['makes']['buckets'])) {
            foreach ($data['aggregations']['makes']['buckets'] as $bucket) {
                $makes[] = $bucket['key'];
            }
        }

        return $makes;
    }

    public function index()
    {

        $makes = $this->getData();

        return fractal()
            ->collection($makes)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->respond();
    }
}
