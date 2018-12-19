<?php

namespace App\Transformers;

use App\Models\Deal;
use League\Fractal\TransformerAbstract;

class DealTransformer extends TransformerAbstract
{
    public function transform(Deal $deal)
    {
        //
        // Always make sure we're using the same data structures.
        $data = $deal->toSearchableArray();

        //return (new DealSearchTransformer())->transform(['_source' => $data]);
        return (new DealDetailSearchTransformer())->transform(['_source' => $data]);
    }
}
