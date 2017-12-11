<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\IncentiveImporter;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Cache;

class RebatesController extends Controller
{
    use ValidatesRequests;

    public function getRebates(IncentiveImporter $importer)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
            'selected_rebate_ids' => 'array:int',
        ]);

        $cacheKey = $importer->getCacheKey(
            request('zipcode'),
            request('vin'),
            request('selected_rebate_ids', [])
        );

        $rebates = Cache::remember($cacheKey, 1440, function () use ($importer) {
            return $importer->availableRebates(
                request('vin'),
                request('zip'),
                request('selected_rebate_ids')
            );
        });

        return response()->json($rebates);
    }
}
