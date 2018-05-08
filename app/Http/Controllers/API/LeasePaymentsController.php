<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\Carleton\Client;
use DeliverMyRide\Carleton\QuoteParameters;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LeasePaymentsController extends BaseAPIController
{
    public function getLeasePayments(Client $client)
    {
        $this->validate(request(), [
            'tax_rate' => 'required',
            'acquisition_fee' => 'required',
            'doc_fee' => 'required',
            'cash_down.*' => 'required',
            'rebate' => 'required',
            'license_fee' => 'required',
            'cvr_fee' => 'required',
            'msrp' => 'required',
            'cash_advance' => 'required',
            'terms.*.moneyFactor' => 'required',
            'terms.*.residualPercent' => 'required',
            'terms.*.annualMileage.*.residualPercent' => 'required',

        ]);

        return $client->getLeasePaymentsFor(
            request('cash_down'),
            request('terms'),
            request('tax_rate'),
            request('acquisition_fee'),
            request('doc_fee'),
            request('rebate'),
            request('license_fee'),
            request('cvr_fee'),
            request('msrp'),
            request('cash_advance')
        );
    }
}
