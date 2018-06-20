<?php

namespace App\Http\Controllers\API;

use DeliverMyRide\Carleton\Client;
use App\Models\Deal;

class DealLeasePaymentsController extends BaseAPIController
{
    public function getLeasePayments(Deal $deal, Client $client)
    {
        $this->validate(request(), [
            'cash_due.*' => 'required',
            'rebate' => 'required',
            'msrp' => 'required',
            'cash_advance' => 'required',
            'terms.*.moneyFactor' => 'required',
            'terms.*.residualPercent' => 'required',
            'terms.*.annualMileage.*.residualPercent' => 'required',
        ]);

        $params = [
            'tax_rate' => 6,
            'acquisition_fee' => $deal->dealer->acquisition_fee,
            'doc_fee' => $deal->dealer->doc_fee,
            'registration_fee' => $deal->dealer->registration_fee,
            'cvr_fee' => $deal->dealer->cvr_fee,
        ];

        return $client->getLeasePaymentsFor(
            request('cash_due'),
            request('terms'),
            $params['tax_rate'],
            $params['acquisition_fee'],
            $params['doc_fee'],
            request('rebate'),
            $params['doc_fee'],
            $params['cvr_fee'],
            request('msrp'),
            request('cash_advance')
        );
    }
}
