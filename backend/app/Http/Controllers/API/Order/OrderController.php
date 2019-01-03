<?php

namespace App\Http\Controllers\API\Order;

use Illuminate\Http\Request;
use App\Transformers\PurchaseListTransformer;
use League\Fractal\Serializer\ArraySerializer;
use App\Http\Controllers\API\BaseAPIController;

class OrderController extends BaseAPIController
{
    public function list(Request $request)
    {
        $user = $request->user();
        $purchases = $user->purchases()->orderBy('created_at', 'desc')->get();

        return fractal()
            ->collection($purchases)
            ->transformWith(PurchaseListTransformer::class)
            ->serializeWith(new ArraySerializer())
            ->respond();
    }
}
