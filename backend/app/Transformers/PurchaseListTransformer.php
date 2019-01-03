<?php

namespace App\Transformers;

use App\Models\Order\Purchase;
use League\Fractal\TransformerAbstract;

class PurchaseListTransformer extends TransformerAbstract
{
    public function transform(Purchase $purchase)
    {
        return [
            'id' => $purchase->id,
            'created_at' => $purchase->created_at->format(config('app.default_datetime_format')),
            'updated_at' => $purchase->updated_at->format(config('app.default_datetime_format')),
            'status' => $purchase->status,
            'strategy' => $purchase->type,
            'deal_id' => $purchase->deal_id,
            'deal_title' => $purchase->deal->title(),
        ];
    }
}
