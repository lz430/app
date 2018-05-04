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

        $cacheKey = implode('--', [
            'LeasePaymentsController::getLeasePayments',
            implode('-', request('cash_down')),
            request('terms'),
            request('tax_rate'),
            request('acquisition_fee'),
            request('doc_fee'),
            request('rebate'),
            request('license_fee'),
            request('cvr_fee'),
            request('msrp'),
            request('cash_advance'),
            (new \DateTime())->format('Y-m-d'),
        ]);

        if (Cache::has($cacheKey)) {
            Log::debug("Cache HIT ($cacheKey)");
            return Cache::get($cacheKey);
        }

        Log::debug("Cache MISS ($cacheKey)");

        $quoteParameters = [];
        foreach (request('cash_down') as $cash_down) {
            $terms = request('terms');
            foreach (json_decode($terms, true) as $term => $termData) {
                $annualMileages = $termData['annualMileage'];
                foreach ($annualMileages as $annualMileage => $annualMileageData) {
                    $quoteParameter = QuoteParameters::create()
                        ->withTaxRate(request('tax_rate'))
                        ->withAcquisitionFee(request('acquisition_fee'))
                        ->withDocFee(request('doc_fee'))
                        ->withCashDown($cash_down)
                        ->withRebate(request('rebate'))
                        ->withLicenseFee(request('license_fee'))
                        ->withCvrFee(request('cvr_fee'))
                        ->withMsrp(request('msrp'))
                        ->withCashAdvance(request('cash_advance'))
                        ->withMoneyFactor($termData['moneyFactor'])
                        ->withResidualPercentage($annualMileageData['residualPercent'])
                        ->withTerm($term)
                        ->withAnnualMileage($annualMileage);

                    $quoteParameters[] = $quoteParameter;
                }
            }
        }

        $leasePayments = $client->getLeasePaymentsFor($quoteParameters);

        Cache::put($cacheKey, $leasePayments, 60);

        return $leasePayments;
    }
}
