<?php

namespace App\Http\Controllers\API;

use App\Transformers\BodyStyleTransformer;
use DeliverMyRide\JATO\BodyStyles;
use League\Fractal\Serializer\DataArraySerializer;

class BodyStylesController extends BaseAPIController
{
    private const TRANSFORMER = BodyStyleTransformer::class;
    private const RESOURCE_NAME = 'body-styles';

    public function index()
    {
        return fractal()
            ->collection(BodyStyles::ALL)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer)
            ->respond();
    }
}
