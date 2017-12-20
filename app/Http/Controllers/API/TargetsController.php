<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\TargetImporter;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Cache;

class TargetsController extends Controller
{
    use ValidatesRequests;

    public function getTargets(TargetImporter $importer)
    {
        $this->validate(request(), [
            'zipcode' => 'required|string',
            'vin' => 'required|string',
            'selected_target_ids' => 'array:int',
        ]);

        $cacheKey = $importer->getCacheKey(
            request('zipcode'),
            request('vin'),
            request('selected_target_ids', [])
        );

        $targets = Cache::remember($cacheKey, 1440, function () use ($importer) {
            return $importer->availableTargets(
                request('vin'),
                request('zipcode'),
                request('selected_target_ids')
            );
        });

        return response()->json([
            'targets' => $targets
        ]);
    }
}
