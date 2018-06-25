<?php

namespace DeliverMyRide\Carleton;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class Client
{
    private $url;
    private $username;
    private $password;

    /**
     * @param $url
     * @param $username
     * @param $password
     */
    public function __construct($url, $username, $password)
    {
        $this->url = $url;
        $this->username = $username;
        $this->password = $password;
    }
    /**
     * @param $cashDueOptions
     * @param $terms
     * @param $taxRate
     * @param $acquisitionFee
     * @param $docFee
     * @param $rebate
     * @param $licenseFee
     * @param $cvrFee
     * @param $msrp
     * @param $cashAdvance
     * @param $contractDate
     * @return array
     */
    public function buildRequestParams(
        $cashDueOptions,
        $terms,
        $taxRate,
        $acquisitionFee,
        $docFee,
        $rebate,
        $licenseFee,
        $cvrFee,
        $msrp,
        $cashAdvance,
        $contractDate)
    {
        $data = [
            'username' => $this->username,
            'password' => $this->password,
            'quotes' => [],
        ];

        $fees = [
            'acquisition' => [
                'Amount' => $acquisitionFee,
                'Type' => 'Financed',
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => '0',
                'FinanceTaxes' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ],
            'doc' => [
                'Amount' => $docFee,
                'Type' => 'Financed',
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => '0',
                'FinanceTaxes' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ],
            'rebate' => [
                'Amount' => $rebate,
                'Type' => 'Financed',
                'Base' => 'Fixed',
                'DescriptionType' => 'Rebate',
                'TaxIndex' => '1',
                'FinanceTaxes' => 'Yes',
                'CCRPortionFeeTaxed' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ],
            'license' => [
                'Amount' => 23,
                'Type' => 'Financed', // Upfront
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => '0',
                'FinanceTaxes' => 'Yes',
                'RoundToOption' => 'NearestPenny',
            ],
            'cvr' => [
                'Amount' => $cvrFee,
                'Type' => 'Financed',
                'Base' => 'Fixed',
                'DescriptionType' => 'RegularFee',
                'TaxIndex' => '0',
                'FinanceTaxes' => 'No',
                'RoundToOption' => 'NearestPenny',
            ],
        ];

        $terms = json_decode($terms, true);

        foreach ($cashDueOptions as $cashDueValue) {
            foreach($terms as $term => $termData) {
                foreach ($termData['annualMileage'] as $annualMileage => $annualMileageData) {
                    $quote = [
                        'taxRate' => $taxRate,
                        'moneyFactor' => $termData['moneyFactor'],
                        'residualPercent' => $annualMileageData['residualPercent'],
                        'term' => $term,
                        'annualMileage' => $annualMileage,
                        'contractDate' => $contractDate->format('Y-m-d'),
                        'msrp' => $msrp,
                        'cashAdvance' => $cashAdvance,
                        'fees' => $fees,
                    ];

                    $quote['fees']['cashDown'] = [
                        'Amount' => $cashDueValue,
                        'Type' => 'Financed',
                        'Base' => 'Fixed',
                        'DescriptionType' => 'CashDown',
                        'TaxIndex' => '1',
                        'FinanceTaxes' => 'No',
                        'CCRPortionFeeTaxed' => 'Yes',
                        'RoundToOption' => 'NearestPenny',
                    ];

                    $data['quotes'][] = $quote;
                }
            }
        }
        return $data;
    }

    /**
     * @param $data
     * @return string
     * @throws \Throwable
     */
    public function buildRequest($data) {
        $contents = view('carleton.request', $data)->render();
        $contents = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" . $contents;
        $contents = trim(preg_replace('/\s+/', ' ', $contents));
        return $contents;
    }

    /**
     * @param $cashDueOptions
     * @param $terms
     * @param $taxRate
     * @param $acquisitionFee
     * @param $docFee
     * @param $rebate
     * @param $licenseFee
     * @param $cvrFee
     * @param $msrp
     * @param $cashAdvance
     * @param null $contractDate
     * @return array|mixed
     * @throws \Throwable
     */
    public function getLeasePaymentsFor(
        $cashDueOptions,
        $terms,
        $taxRate,
        $acquisitionFee,
        $docFee,
        $rebate,
        $licenseFee,
        $cvrFee,
        $msrp,
        $cashAdvance,
        $contractDate = null
    )
    {
        if (!$contractDate) {
            $contractDate = new \DateTime();
        }

        $params = $this->buildRequestParams(
            $cashDueOptions,
            $terms,
            $taxRate,
            $acquisitionFee,
            $docFee,
            $rebate,
            $licenseFee,
            $cvrFee,
            $msrp,
            $cashAdvance,
            $contractDate
        );

        $request = $this->buildRequest($params);

        $hash = md5($request);
        $cacheKey = "lease-rates-" . $hash;

        if (false && Cache::has($cacheKey)) {
            Log::debug("Cache HIT ($cacheKey)");
            return Cache::get($cacheKey);
        }

        Log::debug("Cache MISS ($cacheKey)");
        $leasePayments = $this->getLeasePaymentsForQuoteParameters($params, $request);
        Cache::put($cacheKey, $leasePayments, count($leasePayments) > 0 ? 360 : 15);
        return $leasePayments;
    }

    /**
     * @param $params
     * @param $request
     * @return array
     */
    public function getLeasePaymentsForQuoteParameters($params, $request)
    {
        $headers = [
            'Content-Type: text/xml; charset="utf-8"',
            'Content-Length: ' . strlen($request),
            'Accept: text/xml',
            'Cache-Control: no-cache',
            'Pragma: no-cache',
            'SOAPAction: "http://www.carletoninc.com/calcs/lease/GetQuotes"'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_USERAGENT, 'DMR');

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);

        $data = curl_exec($ch);
        if ($data === false) {
            $error = curl_error($ch);
            Log::info(var_export($error, true));
            return [];
        }

        $xml = new \SimpleXMLElement($data);
        $xml->registerXPathNamespace('lease', 'http://www.carletoninc.com/calcs/lease');

        $faults = $xml->xpath('/soap:Envelope/soap:Body/soap:Fault');
        if ($faults) {
            Log::info('Could not find lease calculations (response): ' . (string)$faults[0]->faultstring);

            return [];
        }

        $results = [];
        $quotes = $xml->xpath('/soap:Envelope/soap:Body/lease:GetQuotesResponse/lease:GetQuotesResult/lease:Quote');
        for ($i = 0; $i < count($quotes); $i++) {
            $quote = $quotes[$i];
            $input = $params['quotes'][$i];
            $results[$i] = [
                'term' => $input['term'],
                'cash_due' => (float)$input['fees']['cashDown']['Amount'],
                'annual_mileage' => $input['annualMileage'],
                'monthly_payment' => (float)sprintf("%.02f", $quote->RegularPayment),
                'total_amount_at_drive_off' => (float)sprintf("%.02f", $quote->TotalAmountAtDriveOff),
            ];
        }
        return $results;
    }
}
