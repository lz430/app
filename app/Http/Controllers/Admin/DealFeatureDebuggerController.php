<?php

namespace App\Http\Controllers\Admin;

use App\Deal;
use App\Feature;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\Client;
use DeliverMyRide\VAuto\DealFeatureImporter;

class DealFeatureDebuggerController extends Controller
{
    public function show(Deal $deal, Client $client)
    {
        $importer = new DealFeatureImporter($deal, Feature::with('category')->get(), $client);
        $equipment = collect($client->equipmentByVehicleId($deal->version->jato_vehicle_id)['results']);

        return view('admin.deal-feature-debugger')
            ->with('deal', $deal)
            ->with('equipment', $equipment)
            ->with('features', Feature::whereIn('id', $importer->featureIds())->get());
    }
}
