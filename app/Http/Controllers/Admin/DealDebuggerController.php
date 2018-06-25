<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use App\Http\Controllers\Controller;
use DeliverMyRide\JATO\JatoClient;
use GuzzleHttp\Exception\ClientException;

class DealDebuggerController extends Controller
{
    public function show(Deal $deal, JatoClient $client)
    {
        try {
            $leaseRates = $client->incentive->listPrograms(
                    $deal->version ? $deal->version->jato_vehicle_id : 0,
                    ['category' => 8, 'zipCode' => 48103]
                )[0]->leaseRates ?? [];
        } catch (ClientException $e) {
            $leaseRates = [];
        }

        return view('admin.deal-debugger',
            [
                'rates' => $leaseRates,
                'deal' => $deal
            ]
        );

    }
}
