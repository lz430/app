<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Transformers\V1\BodyStyleTransformer;
use DeliverMyRide\JATO\BodyStyles;
use League\Fractal\Serializer\DataArraySerializer;

class BodyStylesController extends Controller
{
    private const TRANSFORMER = BodyStyleTransformer::class;
    private const RESOURCE_NAME = 'body-styles';

    public function index()
    {
        return fractal()
            ->collection(BodyStyles::ALL)
            ->withResourceName(self::RESOURCE_NAME)
            ->transformWith(self::TRANSFORMER)
            ->serializeWith(new DataArraySerializer())
            ->respond();
    }
}
