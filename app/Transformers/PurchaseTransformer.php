<?php

namespace App\Transformers;

use App\Models\Order\Purchase;
use League\Fractal\TransformerAbstract;

class PurchaseTransformer extends TransformerAbstract
{
    public function transform(Purchase $purchase)
    {
        return [
            'id' => $purchase->id,
            'deal_id' => $purchase->deal_id,
            'rebates' => $purchase->rebates,
            'down_payment' => $purchase->down_payment,
            'term' => $purchase->term,
            'msrp' => $purchase->msrp,
            'amount_financed' => $purchase->amount_financed,
            'type' => $purchase->type,
            'dmr_price' => $purchase->dmr_price,
            'application_status' => $purchase->application_status,
            'deal' => fractal()->item($purchase->deal)->transformWith(DealTransformer::class),
        ];
    }
}
